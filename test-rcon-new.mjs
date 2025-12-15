import { Rcon } from 'rcon-client';

const RCON_HOST = 'cobblebode.bed.ovh';
const RCON_PORT = 25642;
const RCON_PASSWORD = '!Apaskasko7503286';

console.log('=== RCON Connection Test (New Host) ===');
console.log(`Host: ${RCON_HOST}`);
console.log(`Port: ${RCON_PORT}`);
console.log('');

const rcon = new Rcon({
  host: RCON_HOST,
  port: RCON_PORT,
  password: RCON_PASSWORD,
});

try {
  console.log('Attempting to connect...');
  console.log('');
  
  await rcon.connect();
  console.log('✓ RCON connection successful!');
  console.log('');
  
  // Test a simple command
  console.log('Testing command: list');
  const response = await rcon.send('list');
  console.log('Response:', response);
  
  await rcon.end();
  process.exit(0);
} catch (error) {
  console.log('✗ RCON connection failed!');
  console.log('Error:', error.message);
  console.log('Error code:', error.code);
  console.log('');
  
  await rcon.end();
  process.exit(1);
}
