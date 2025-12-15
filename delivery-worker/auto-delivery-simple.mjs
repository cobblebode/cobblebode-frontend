import { Rcon } from 'rcon-client';
import { config } from 'dotenv';

config();

const SITE_URL = 'https://cobblebode.mocha.app';
const RCON_CONFIG = {
  host: process.env.RCON_HOST || 'ultra-01.bedhosting.com.br',
  port: parseInt(process.env.RCON_PORT) || 25642,
  password: process.env.RCON_PASSWORD || '!Apaskasko7503286',
  timeout: 10000
};

const CHECK_INTERVAL = 30000; // 30 segundos

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

async function getPendingOrders() {
  try {
    const response = await fetch(`${SITE_URL}/api/delivery/pending`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error.message);
    return [];
  }
}

async function markOrderCompleted(orderId) {
  try {
    const response = await fetch(`${SITE_URL}/api/delivery/complete/${orderId}`, {
      method: 'POST'
    });
    return response.ok;
  } catch (error) {
    console.error('Erro ao marcar pedido como concluído:', error.message);
    return false;
  }
}

async function processPendingOrders() {
  try {
    const orders = await getPendingOrders();

    if (orders.length === 0) {
      return;
    }

    console.log(`\n[${new Date().toISOString()}] Encontrados ${orders.length} pedidos pendentes`);

    for (const order of orders) {
      console.log(`\nProcessando pedido #${order.id} para ${order.player_name}...`);
      console.log(`  Item: ${order.item_name}`);
      console.log(`  Comando: ${order.command.substring(0, 80)}...`);

      const result = await executeRconCommand(order.command);

      if (result.success) {
        console.log(`  ✓ Entregue com sucesso!`);
        console.log(`  Resposta do servidor: ${result.response}`);

        const completed = await markOrderCompleted(order.id);
        if (completed) {
          console.log(`  ✓ Pedido #${order.id} marcado como concluído`);
        } else {
          console.log(`  ⚠️  Aviso: Item entregue mas não foi possível marcar como concluído`);
        }
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
  console.log(`\nSite: ${SITE_URL}`);
  console.log(`RCON: ${RCON_CONFIG.host}:${RCON_CONFIG.port}`);
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
