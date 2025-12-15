# Sistema de Entrega Automática

Este script processa automaticamente os pedidos aprovados e entrega os itens via RCON.

## Como funciona

1. O script consulta a API do site a cada 30 segundos
2. Quando encontra pedidos com pagamento aprovado
3. Entrega o item via RCON
4. Marca o pedido como concluído

## Instalação Rápida

### No seu computador Windows:

1. Baixe e instale o Node.js: https://nodejs.org/
2. Baixe os arquivos desta pasta (delivery-worker)
3. Abra o terminal nesta pasta (Shift + Botão direito → "Abrir janela do PowerShell aqui")
4. Execute:

```bash
npm install
```

5. Crie um arquivo `.env` (copie o `.env.example`) e configure:

```
RCON_HOST=ultra-01.bedhosting.com.br
RCON_PORT=25642
RCON_PASSWORD=!Apaskasko7503286
```

6. Rode o sistema:

```bash
node auto-delivery-simple.mjs
```

Pronto! Deixe essa janela aberta e o sistema vai processar automaticamente os pedidos.

### Em um VPS Linux:

```bash
cd ~
mkdir cobblemon-delivery
cd cobblemon-delivery

# Copie os arquivos para cá

npm install

# Crie o arquivo .env com as configurações

# Criar um serviço systemd para rodar sempre
sudo nano /etc/systemd/system/cobblemon-delivery.service
```

Adicione:
```
[Unit]
Description=Cobblemon Auto Delivery
After=network.target

[Service]
Type=simple
User=seu-usuario
WorkingDirectory=/home/seu-usuario/cobblemon-delivery
ExecStart=/usr/bin/node auto-delivery-simple.mjs
Restart=always

[Install]
WantedBy=multi-user.target
```

Depois:
```bash
sudo systemctl enable cobblemon-delivery
sudo systemctl start cobblemon-delivery
sudo systemctl status cobblemon-delivery
```

## Verificar logs

Para ver se está funcionando:

```bash
sudo journalctl -u cobblemon-delivery -f
```

## Parar o serviço

```bash
sudo systemctl stop cobblemon-delivery
```
