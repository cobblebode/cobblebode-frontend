import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { Rcon } from "rcon-client";

const app = new Hono<{ Bindings: Env }>();

// Execute RCON command on Minecraft server
async function executeRconCommand(
  env: Env,
  command: string
): Promise<string> {
  const rcon = new Rcon({
    host: env.RCON_HOST,
    port: parseInt(env.RCON_PORT),
    password: env.RCON_PASSWORD,
  });

  try {
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    return response;
  } catch (error) {
    console.error("RCON command failed:", error);
    await rcon.end();
    throw error;
  }
}

// Build item command with proper JSON.stringify for custom_name
function buildItemCommand(playerName: string, itemId: string, displayName: string): string {
  const customName = JSON.stringify({ 
    text: displayName, 
    color: "gold", 
    bold: true 
  });
  return `give ${playerName} ${itemId}[minecraft:custom_name='${customName}']`;
}

// Get player count via API
app.get("/api/players/count", async (c) => {
  try {
    // Using mcsrvstat.us service to query Minecraft server status
    const serverAddress = "cobblebode.bed.ovh";
    const response = await fetch(`https://api.mcsrvstat.us/3/${serverAddress}`, {
      headers: {
        'User-Agent': 'CobbleBode-Website/1.0'
      }
    });
    
    if (!response.ok) {
      console.error("API response not OK:", response.status);
      return c.json({ count: 0, max: 0, online: false });
    }
    
    const text = await response.text();
    
    // Check if we got rate limited
    if (text.includes('rate limit') || text.includes('Your request')) {
      console.error("Rate limited by API");
      return c.json({ count: 0, max: 0, online: false });
    }
    
    const data = JSON.parse(text);
    
    // Check if server is online and has players data
    if (data.online && data.players) {
      return c.json({ 
        count: data.players.online || 0,
        max: data.players.max || 0,
        online: true
      });
    }
    
    return c.json({ count: 0, max: 0, online: false });
  } catch (error) {
    console.error("Failed to get player count:", error);
    return c.json({ count: 0, max: 0, online: false });
  }
});

// MercadoPago payment creation
app.post(
  "/api/payments/create",
  zValidator(
    "json",
    z.object({
      productId: z.number(),
      playerName: z.string().min(1),
      playerEmail: z.string().email(),
    })
  ),
  async (c) => {
    try {
      const { productId, playerName, playerEmail } = c.req.valid("json");
      const db = c.env.DB;
      const accessToken = c.env.MERCADOPAGO_ACCESS_TOKEN;

      // Get product
      const product = await db
        .prepare("SELECT * FROM vip_products WHERE id = ? AND is_active = 1")
        .bind(productId)
        .first();

      if (!product) {
        return c.json({ error: "Produto não encontrado" }, 404);
      }

      // Create order
      const orderResult = await db
        .prepare(
          "INSERT INTO orders (player_name, player_email, product_id, amount, status) VALUES (?, ?, ?, ?, ?)"
        )
        .bind(playerName, playerEmail, productId, product.price, "pending")
        .run();

      const orderId = orderResult.meta.last_row_id;

      // Create MercadoPago payment
      const mpPayment = {
        transaction_amount: product.price,
        description: `${product.name} - ${playerName}`,
        payment_method_id: "pix",
        payer: {
          email: playerEmail,
          first_name: playerName,
        },
        notification_url: `https://cobblebode.mocha.app/api/payments/webhook`,
        external_reference: orderId.toString(),
      };

      const mpResponse = await fetch(
        "https://api.mercadopago.com/v1/payments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `vip-${productId}-${Date.now()}`,
          },
          body: JSON.stringify(mpPayment),
        }
      );

      if (!mpResponse.ok) {
        const error = await mpResponse.text();
        console.error("MercadoPago error:", error);
        console.error("MercadoPago status:", mpResponse.status);
        return c.json({ 
          error: "Erro ao processar pagamento com MercadoPago", 
          details: error
        }, 500);
      }

      const paymentData = await mpResponse.json() as any;

      // Save payment info
      await db
        .prepare(
          `INSERT INTO payments 
          (order_id, payment_id, status, amount, payment_method, pix_qr_code, pix_qr_code_base64, pix_copy_paste, expires_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          orderId,
          paymentData.id,
          paymentData.status,
          paymentData.transaction_amount,
          "pix",
          paymentData.point_of_interaction?.transaction_data?.qr_code || null,
          paymentData.point_of_interaction?.transaction_data?.qr_code_base64 ||
            null,
          paymentData.point_of_interaction?.transaction_data?.qr_code || null,
          paymentData.date_of_expiration || null
        )
        .run();

      return c.json({
        orderId,
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode:
          paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
        qrCodeText:
          paymentData.point_of_interaction?.transaction_data?.qr_code,
        amount: paymentData.transaction_amount,
      });
    } catch (error) {
      console.error("Payment creation error:", error);
      return c.json({ error: "Erro ao criar pagamento" }, 500);
    }
  }
);

// Check payment status
app.get("/api/payments/:orderId/status", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const db = c.env.DB;

    const payment = await db
      .prepare(
        "SELECT p.*, o.player_name, o.status as order_status FROM payments p JOIN orders o ON p.order_id = o.id WHERE p.order_id = ?"
      )
      .bind(orderId)
      .first();

    if (!payment) {
      return c.json({ error: "Pagamento não encontrado" }, 404);
    }

    return c.json({
      status: payment.status,
      orderStatus: payment.order_status,
      paidAt: payment.paid_at,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return c.json({ error: "Erro ao verificar status" }, 500);
  }
});

// MercadoPago webhook
app.post("/api/payments/webhook", async (c) => {
  try {
    const body = await c.req.json();
    const db = c.env.DB;
    const accessToken = c.env.MERCADOPAGO_ACCESS_TOKEN;

    if (body.type === "payment") {
      const paymentId = body.data.id;

      // Get payment details from MercadoPago
      const mpResponse = await fetch(
        `https://api.mercadopago.com/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!mpResponse.ok) {
        throw new Error("Failed to get payment details");
      }

      const paymentData = await mpResponse.json();

      // Update payment status
      await db
        .prepare(
          "UPDATE payments SET status = ?, paid_at = ?, updated_at = CURRENT_TIMESTAMP WHERE payment_id = ?"
        )
        .bind(
          (paymentData as any).status,
          (paymentData as any).status === "approved"
            ? new Date().toISOString()
            : null,
          paymentId
        )
        .run();

      // If approved, try to deliver VIP or item via RCON
      if ((paymentData as any).status === "approved") {
        // Get order with payment details
        const orderData = await db
          .prepare(
            "SELECT o.* FROM payments pm JOIN orders o ON pm.order_id = o.id WHERE pm.payment_id = ?"
          )
          .bind(paymentId)
          .first();

        if (orderData) {
          let deliverySuccessful = false;

          // Handle VIP purchase
          if (orderData.order_type === "vip" && orderData.product_id) {
            const product = await db
              .prepare("SELECT * FROM vip_products WHERE id = ?")
              .bind(orderData.product_id)
              .first();

            if (product) {
              const vipGroup =
                product.name === "Vip Diamante" ? "vip2" : "vip";
              const durationDays = product.duration_days || 30;
              const command = `lp user ${orderData.player_name} parent addtemp ${vipGroup} ${durationDays}d`;

              try {
                const rconResponse = await executeRconCommand(c.env, command);
                console.log(
                  `VIP activated for ${orderData.player_name} (${durationDays} days): ${rconResponse}`
                );
                deliverySuccessful = true;
              } catch (rconError) {
                console.error("Failed to activate VIP via RCON:", rconError);
                console.log("Order will remain pending for manual delivery");
              }
            }
          }

          // Handle item purchase
          if (orderData.order_type === "item" && orderData.item_id) {
            const item = await db
              .prepare("SELECT * FROM shop_items WHERE id = ?")
              .bind(orderData.item_id)
              .first();

            if (item) {
              // Build command using JSON.stringify for proper RCON formatting
              const command = buildItemCommand(
                orderData.player_name as string,
                (item as any).item_command,
                (item as any).name
              );

              try {
                const rconResponse = await executeRconCommand(c.env, command);
                console.log(
                  `Item delivered to ${orderData.player_name}: ${rconResponse}`
                );
                deliverySuccessful = true;
              } catch (rconError) {
                console.error("Failed to deliver item via RCON:", rconError);
                console.log("Order will remain pending for manual delivery");
              }
            }
          }

          // Only mark as completed if RCON delivery was successful
          if (deliverySuccessful) {
            await db
              .prepare(
                "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?"
              )
              .bind("completed", orderData.id)
              .run();
          }
        }
      }
    }

    return c.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return c.json({ error: "Webhook processing failed" }, 500);
  }
});

// Get VIP products
app.get("/api/products", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db
      .prepare("SELECT * FROM vip_products WHERE is_active = 1 ORDER BY price")
      .all();

    return c.json(results);
  } catch (error) {
    console.error("Products fetch error:", error);
    return c.json({ error: "Erro ao buscar produtos" }, 500);
  }
});

// Get shop items
app.get("/api/shop/items", async (c) => {
  try {
    const db = c.env.DB;
    const { results } = await db
      .prepare("SELECT * FROM shop_items WHERE is_active = 1 ORDER BY id")
      .all();

    return c.json(results);
  } catch (error) {
    console.error("Shop items fetch error:", error);
    return c.json({ error: "Erro ao buscar itens" }, 500);
  }
});





// Delivery API - Get pending orders for automatic delivery
app.get("/api/delivery/pending", async (c) => {
  try {
    const db = c.env.DB;
    
    const { results } = await db
      .prepare(`
        SELECT DISTINCT
          o.id,
          o.player_name,
          o.order_type,
          o.item_id,
          o.product_id,
          CASE 
            WHEN o.order_type = 'vip' THEN vp.name
            WHEN o.order_type = 'item' THEN si.name
          END as item_name,
          si.item_command as item_minecraft_id,
          CASE
            WHEN o.order_type = 'vip' THEN 'lp user ' || o.player_name || ' parent addtemp ' || 
              CASE WHEN vp.name = 'Vip Diamante' THEN 'vip2' ELSE 'vip' END || ' ' || 
              COALESCE(vp.duration_days, 30) || 'd'
          END as command
        FROM orders o
        INNER JOIN payments p ON p.order_id = o.id
        LEFT JOIN vip_products vp ON o.order_type = 'vip' AND o.product_id = vp.id
        LEFT JOIN shop_items si ON o.order_type = 'item' AND o.item_id = si.id
        WHERE p.status = 'approved' AND o.status = 'pending'
        ORDER BY o.created_at ASC
      `)
      .all();

    // Clean up item_minecraft_id - remove "give {player} " prefix if present
    const cleanedResults = results.map((order: any) => {
      if (order.item_minecraft_id) {
        order.item_minecraft_id = order.item_minecraft_id.replace(/^give \{player\} /, '');
      }
      return order;
    });

    return c.json(cleanedResults);
  } catch (error) {
    console.error("Get pending orders error:", error);
    return c.json({ error: "Erro ao buscar pedidos" }, 500);
  }
});

// Delivery API - Mark order as completed
app.post("/api/delivery/complete/:orderId", async (c) => {
  try {
    const orderId = c.req.param("orderId");
    const db = c.env.DB;

    await db
      .prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind("completed", orderId)
      .run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Complete order error:", error);
    return c.json({ error: "Erro ao completar pedido" }, 500);
  }
});

// Admin password middleware
const ADMIN_PASSWORD = "!APASKASKO123";

function verifyAdminPassword(c: any): boolean {
  const password = c.req.header("X-Admin-Password");
  return password === ADMIN_PASSWORD;
}

// Admin API - Get pending orders
app.get("/api/admin/pending-orders", async (c) => {
  if (!verifyAdminPassword(c)) {
    return c.json({ error: "Não autorizado" }, 401);
  }
  try {
    const db = c.env.DB;
    
    const { results } = await db
      .prepare(`
        SELECT 
          o.id,
          o.player_name,
          o.order_type,
          o.item_id,
          o.product_id,
          o.amount,
          p.payment_id,
          o.created_at,
          CASE 
            WHEN o.order_type = 'vip' THEN vp.name
            WHEN o.order_type = 'item' THEN si.name
          END as item_name,
          si.item_command as item_minecraft_id,
          CASE
            WHEN o.order_type = 'vip' THEN 'lp user ' || o.player_name || ' parent addtemp ' || 
              CASE WHEN vp.name = 'Vip Diamante' THEN 'vip2' ELSE 'vip' END || ' ' || 
              COALESCE(vp.duration_days, 30) || 'd'
          END as command
        FROM orders o
        INNER JOIN payments p ON p.order_id = o.id
        LEFT JOIN vip_products vp ON o.order_type = 'vip' AND o.product_id = vp.id
        LEFT JOIN shop_items si ON o.order_type = 'item' AND o.item_id = si.id
        WHERE p.status = 'approved' AND o.status = 'pending'
        ORDER BY o.created_at ASC
      `)
      .all();

    return c.json(results);
  } catch (error) {
    console.error("Get pending orders error:", error);
    return c.json({ error: "Erro ao buscar pedidos" }, 500);
  }
});

// Admin API - Complete order manually
app.post("/api/admin/orders/:orderId/complete", async (c) => {
  if (!verifyAdminPassword(c)) {
    return c.json({ error: "Não autorizado" }, 401);
  }
  try {
    const orderId = c.req.param("orderId");
    const db = c.env.DB;

    await db
      .prepare("UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .bind("completed", orderId)
      .run();

    return c.json({ success: true });
  } catch (error) {
    console.error("Complete order error:", error);
    return c.json({ error: "Erro ao completar pedido" }, 500);
  }
});

// Test purchase endpoint - simulates a complete purchase without real payment
app.post(
  "/api/debug/test-purchase",
  zValidator(
    "json",
    z.object({
      itemId: z.number(),
      playerName: z.string().min(1),
    })
  ),
  async (c) => {
    try {
      const { itemId, playerName } = c.req.valid("json");
      const db = c.env.DB;

      // Get item
      const item = await db
        .prepare("SELECT * FROM shop_items WHERE id = ?")
        .bind(itemId)
        .first();

      if (!item) {
        return c.json({ error: "Item não encontrado" }, 404);
      }

      // Create test order
      const orderResult = await db
        .prepare(
          "INSERT INTO orders (player_name, player_email, product_id, item_id, order_type, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(playerName, "teste@teste.com", 0, itemId, "item", item.price, "pending")
        .run();

      const orderId = orderResult.meta.last_row_id;
      const testPaymentId = `TEST_${Date.now()}`;

      // Create approved payment
      await db
        .prepare(
          "INSERT INTO payments (order_id, payment_id, status, amount, payment_method, paid_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(
          orderId,
          testPaymentId,
          "approved",
          item.price,
          "pix",
          new Date().toISOString()
        )
        .run();

      return c.json({
        success: true,
        orderId,
        paymentId: testPaymentId,
        message: `Pedido de teste criado! Aguarde 30-60 segundos para o script de entrega processar.`,
        playerName,
        itemName: item.name,
      });
    } catch (error) {
      console.error("Test purchase error:", error);
      return c.json({ error: (error as any).message }, 500);
    }
  }
);

// Create shop item purchase
app.post(
  "/api/shop/purchase",
  zValidator(
    "json",
    z.object({
      itemId: z.number(),
      playerName: z.string().min(1),
      playerEmail: z.string().email(),
    })
  ),
  async (c) => {
    try {
      const { itemId, playerName, playerEmail } = c.req.valid("json");
      const db = c.env.DB;
      const accessToken = c.env.MERCADOPAGO_ACCESS_TOKEN;

      // Get item
      const item = await db
        .prepare("SELECT * FROM shop_items WHERE id = ? AND is_active = 1")
        .bind(itemId)
        .first();

      if (!item) {
        return c.json({ error: "Item não encontrado" }, 404);
      }

      // Create order for item purchase (product_id set to 0 for items since it's NOT NULL)
      const orderResult = await db
        .prepare(
          "INSERT INTO orders (player_name, player_email, product_id, item_id, order_type, amount, status) VALUES (?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(playerName, playerEmail, 0, itemId, "item", item.price, "pending")
        .run();

      const orderId = orderResult.meta.last_row_id;

      // Create MercadoPago payment
      const mpPayment = {
        transaction_amount: item.price,
        description: `${item.name} - ${playerName}`,
        payment_method_id: "pix",
        payer: {
          email: playerEmail,
          first_name: playerName,
        },
        notification_url: `https://cobblebode.mocha.app/api/payments/webhook`,
        external_reference: orderId.toString(),
      };

      const mpResponse = await fetch(
        "https://api.mercadopago.com/v1/payments",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Idempotency-Key": `item-${itemId}-${Date.now()}`,
          },
          body: JSON.stringify(mpPayment),
        }
      );

      if (!mpResponse.ok) {
        const error = await mpResponse.text();
        console.error("MercadoPago error:", error);
        throw new Error("Falha ao criar pagamento");
      }

      const paymentData = await mpResponse.json() as any;

      // Save payment info
      await db
        .prepare(
          `INSERT INTO payments 
          (order_id, payment_id, status, amount, payment_method, pix_qr_code, pix_qr_code_base64, pix_copy_paste, expires_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          orderId,
          paymentData.id,
          paymentData.status,
          paymentData.transaction_amount,
          "pix",
          paymentData.point_of_interaction?.transaction_data?.qr_code || null,
          paymentData.point_of_interaction?.transaction_data?.qr_code_base64 ||
            null,
          paymentData.point_of_interaction?.transaction_data?.qr_code || null,
          paymentData.date_of_expiration || null
        )
        .run();

      return c.json({
        orderId,
        paymentId: paymentData.id,
        status: paymentData.status,
        qrCode:
          paymentData.point_of_interaction?.transaction_data?.qr_code_base64,
        qrCodeText:
          paymentData.point_of_interaction?.transaction_data?.qr_code,
        amount: paymentData.transaction_amount,
      });
    } catch (error) {
      console.error("Shop purchase error:", error);
      return c.json({ error: "Erro ao criar pagamento" }, 500);
    }
  }
);

export default app;
