import { Rcon } from 'rcon-client';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config();

const RCON_CONFIG = {
  host: process.env.RCON_HOST || 'ultra-01.bedhosting.com.br',
  port: parseInt(process.env.RCON_PORT) || 25642,
  password: process.env.RCON_PASSWORD || '!Apaskasko7503286',
  timeout: 10000
};

const CHECK_INTERVAL = 30000; // 30 segundos

// Conectar ao banco de dados
const db = createClient({
  url: process.env.DATABASE_URL
});

async function executeRconCommand(command) {
  const rcon = new Rcon(RCON_CONFIG);
  
  try {
    await rcon.connect();
    const response = await rcon.send(command);
    await rcon.end();
    return { success: true, response };
  } catch (error) {
    console.error('RCON error:', error.message);
    try { await rcon.end(); } catch {}
    return { success: false, error: error.message };
  }
}

async function processPendingOrders() {
  try {
    // Buscar pedidos aprovados e pendentes
    const orders = await db.execute({
      sql: `
        SELECT o.*, p.status as payment_status
        FROM orders o
        JOIN payments p ON p.order_id = o.id
        WHERE p.status = 'approved' AND o.status = 'pending'
        ORDER BY o.created_at ASC
      `,
      args: []
    });

    if (orders.rows.length === 0) {
      return;
    }

    console.log(`\n[${new Date().toISOString()}] Encontrados ${orders.rows.length} pedidos pendentes`);

    for (const order of orders.rows) {
      console.log(`\nProcessando pedido #${order.id} para ${order.player_name}...`);

      let command = null;
      let itemName = null;

      // Pedido de VIP
      if (order.order_type === 'vip' && order.product_id) {
        const product = await db.execute({
          sql: 'SELECT * FROM vip_products WHERE id = ?',
          args: [order.product_id]
        });

        if (product.rows.length > 0) {
          const vipGroup = product.rows[0].name === 'Vip Diamante' ? 'vip2' : 'vip';
          const durationDays = product.rows[0].duration_days || 30;
          command = `lp user ${order.player_name} parent addtemp ${vipGroup} ${durationDays}d`;
          itemName = `VIP ${product.rows[0].name} (${durationDays} dias)`;
        }
      }

      // Pedido de item da loja
      if (order.order_type === 'item' && order.item_id) {
        const item = await db.execute({
          sql: 'SELECT * FROM shop_items WHERE id = ?',
          args: [order.item_id]
        });

        if (item.rows.length > 0) {
          command = item.rows[0].item_command.replace('{player}', order.player_name);
          itemName = item.rows[0].name;
        }
      }

      if (!command) {
        console.log(`  ⚠️  Não foi possível determinar o comando para o pedido #${order.id}`);
        continue;
      }

      console.log(`  Item: ${itemName}`);
      console.log(`  Comando: ${command.substring(0, 80)}...`);

      const result = await executeRconCommand(command);

      if (result.success) {
        console.log(`  ✓ Entregue com sucesso!`);
        console.log(`  Resposta do servidor: ${result.response}`);

        // Marcar como concluído
        await db.execute({
          sql: 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          args: ['completed', order.id]
        });

        console.log(`  ✓ Pedido #${order.id} marcado como concluído`);
      } else {
        console.log(`  ✗ Falha na entrega: ${result.error}`);
        console.log(`  O pedido #${order.id} permanece pendente para nova tentativa`);
      }

      // Pequena pausa entre entregas
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  } catch (error) {
    console.error('Erro ao processar pedidos:', error.message);
  }
}

async function main() {
  console.log('==============================================');
  console.log('  Sistema de Entrega Automática - CobbleBode');
  console.log('==============================================');
  console.log(`\nRCON: ${RCON_CONFIG.host}:${RCON_CONFIG.port}`);
  console.log(`Verificando a cada ${CHECK_INTERVAL / 1000} segundos\n`);

  // Verificar conexão RCON inicial
  console.log('Testando conexão RCON...');
  const testResult = await executeRconCommand('list');
  
  if (testResult.success) {
    console.log('✓ RCON conectado com sucesso!\n');
  } else {
    console.error('✗ Falha ao conectar RCON:', testResult.error);
    console.error('\nVerifique as configurações e tente novamente.\n');
    process.exit(1);
  }

  // Loop principal
  console.log('Iniciando monitoramento de pedidos...\n');
  
  while (true) {
    await processPendingOrders();
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
}

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('\n✗ Erro não tratado:', error.message);
  console.error('O sistema continuará rodando...\n');
});

process.on('SIGINT', () => {
  console.log('\n\nEncerrando sistema de entrega...');
  process.exit(0);
});

main().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
});
