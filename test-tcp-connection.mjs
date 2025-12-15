import net from 'net';

function testPort(host, port) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      console.log(`✓ Port ${port} on ${host} is OPEN`);
      socket.destroy();
      resolve(true);
    });
    
    socket.on('timeout', () => {
      console.log(`✗ Port ${port} on ${host} TIMEOUT (firewall blocking or no service listening)`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      if (err.code === 'ECONNREFUSED') {
        console.log(`✗ Port ${port} on ${host} REFUSED (service not running or firewall actively blocking)`);
      } else {
        console.log(`✗ Port ${port} on ${host} ERROR: ${err.message}`);
      }
      resolve(false);
    });
    
    socket.connect(port, host);
  });
}

async function main() {
  const host = 'cobblebode.bed.ovh';
  
  console.log('=== Testing Connectivity ===');
  console.log(`Host: ${host}`);
  console.log('');
  
  console.log('Testing Minecraft game port (25565)...');
  await testPort(host, 25565);
  console.log('');
  
  console.log('Testing RCON port (25575)...');
  await testPort(host, 25575);
  console.log('');
  
  console.log('Testing alternative port (10039 - old server)...');
  await testPort('plus-02.bedhosting.com.br', 10039);
}

main();
