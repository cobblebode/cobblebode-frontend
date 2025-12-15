# Exportação Completa - CobbleBode Website

## Informações do Projeto

**Nome:** CobbleBode - Servidor Cobblemon
**Tecnologia:** React + TypeScript + Cloudflare Workers + D1 Database
**Domínio:** cobblebode.mocha.app
**Funcionalidades:**
- Sistema de pagamentos via MercadoPago (PIX)
- Integração RCON com servidor Minecraft
- Loja VIP (produtos recorrentes)
- Loja de Itens (chaves lendárias)
- Sistema de entrega automática via RCON

---

## Estrutura de Arquivos

```
/
├── src/
│   ├── worker/
│   │   └── index.ts (Backend API - Cloudflare Worker)
│   └── react-app/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── Store.tsx (Loja VIP)
│       │   ├── Shop.tsx (Loja de Itens)
│       │   ├── Rules.tsx
│       │   ├── Downloads.tsx
│       │   └── Admin.tsx
│       └── components/
│           ├── Navbar.tsx
│           ├── Footer.tsx
│           ├── Hero.tsx
│           ├── PlayersOnline.tsx
│           ├── PlayNow.tsx
│           └── Links.tsx
├── delivery.js (Script de entrega automática)
├── package.json
├── index.html
└── wrangler.json
```

---

## Backend API (src/worker/index.ts)

```typescript
${await Deno.readTextFile('/app/src/worker/index.ts')}
```

---

## Frontend - Estrutura Principal

### App.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/App.tsx')}
```

---

## Páginas

### Home.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/pages/Home.tsx')}
```

### Store.tsx (Loja VIP)
```typescript
${await Deno.readTextFile('/app/src/react-app/pages/Store.tsx')}
```

### Shop.tsx (Loja de Itens)
```typescript
${await Deno.readTextFile('/app/src/react-app/pages/Shop.tsx')}
```

### Rules.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/pages/Rules.tsx')}
```

### Downloads.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/pages/Downloads.tsx')}
```

---

## Componentes

### Navbar.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/components/Navbar.tsx')}
```

### Footer.tsx
```typescript
${await Deno.readTextFile('/app/src/react-app/components/Footer.tsx')}
```

---

## Banco de Dados (D1 - SQLite)

### Schema

```sql
CREATE TABLE vip_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  duration_days INTEGER,
  features TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player_name TEXT NOT NULL,
  player_email TEXT NOT NULL,
  product_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL,
  payment_id TEXT,
  payment_method TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  item_id INTEGER,
  order_type TEXT DEFAULT 'vip',
  product_id_nullable INTEGER
);

CREATE TABLE payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  payment_id TEXT NOT NULL,
  status TEXT NOT NULL,
  amount REAL NOT NULL,
  payment_method TEXT,
  pix_qr_code TEXT,
  pix_qr_code_base64 TEXT,
  pix_copy_paste TEXT,
  expires_at TIMESTAMP,
  paid_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shop_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  item_command TEXT NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Configuração

### package.json
```json
${await Deno.readTextFile('/app/package.json')}
```

---

## Secrets/Variáveis de Ambiente

### Produção (configuradas no Mocha)
- `MERCADOPAGO_PUBLIC_KEY`: Chave pública do MercadoPago
- `MERCADOPAGO_ACCESS_TOKEN`: Token de acesso do MercadoPago
- `RCON_HOST`: ultra-01.bedhosting.com.br
- `RCON_PORT`: 25642
- `RCON_PASSWORD`: !Apaskasko7503286

---

## Script de Entrega Automática (delivery.js)

```javascript
${await Deno.readTextFile('/app/delivery.js')}
```

---

## Fluxo de Pagamento e Entrega

### Loja VIP
1. Cliente seleciona produto VIP
2. Preenche nick e email
3. Sistema gera QR Code PIX via MercadoPago
4. MercadoPago envia webhook quando pagamento aprovado
5. Worker recebe webhook e executa comando RCON: `lp user {player} parent addtemp {vip/vip2} 30d`
6. VIP ativado automaticamente no servidor

### Loja de Itens
1. Cliente seleciona chave lendária
2. Preenche nick e email
3. Sistema gera QR Code PIX
4. MercadoPago envia webhook quando pagamento aprovado
5. Worker recebe webhook e marca pedido como "approved/pending"
6. Script delivery.js (rodando no Render) busca pedidos pendentes a cada 30s
7. Script executa comando RCON com item customizado
8. Marca pedido como "completed"

---

## Endpoints da API

### Players
- `GET /api/players/count` - Retorna quantidade de jogadores online

### Pagamentos
- `POST /api/payments/create` - Cria pagamento VIP
- `GET /api/payments/:orderId/status` - Verifica status do pagamento
- `POST /api/payments/webhook` - Webhook do MercadoPago

### Produtos
- `GET /api/products` - Lista produtos VIP
- `GET /api/shop/items` - Lista itens da loja

### Shop
- `POST /api/shop/purchase` - Cria compra de item

### Delivery (para script automático)
- `GET /api/delivery/pending` - Lista pedidos aprovados pendentes
- `POST /api/delivery/complete/:orderId` - Marca pedido como completo

---

## Comandos RCON Utilizados

### VIP Ouro (30 dias)
```
lp user {player_name} parent addtemp vip 30d
```

### VIP Diamante (30 dias)
```
lp user {player_name} parent addtemp vip2 30d
```

### Chave Lendária (exemplo Gen 1-3)
```
give {player_name} cobblemontrainerbattle:elite_aaron_ticket[minecraft:custom_name='{"text":"Chave de Lendário (Gen 1-3)","color":"gold","bold":true}']
```

---

## Dados de Produtos

### VIP Ouro (R$ 29,90)
Recursos:
- Desconto na loja
- Comando /pokeheal
- Comando /pc
- Comando /daycare
- Comando /rtp (sem cooldown)
- Homes extras
- Kit mensal: Pokebolas, Ferramentas e Armaduras de diamante, itens de EXP e muito mais!

### VIP Diamante (R$ 59,90)
Recursos:
- Tudo do Vip Ouro
- Comando /fly
- Kit premium: 1x omni ring, 2x master ball, 1x ability patch, itens de breed, vitaminas, elytra, foguetes, nether star, mega stone e muito mais!
- Vantagens exclusivas

### Chaves Lendárias (R$ 1,00 cada - TESTE)
1. **Gen 1-3**: cobblemontrainerbattle:elite_aaron_ticket
2. **Gen 4-5**: cobblemontrainerbattle:leader_volkner_ticket
3. **Gen 6-7**: cobblemontrainerbattle:champion_cynthia_ticket
4. **Gen 8-9**: cobblemontrainerbattle:elite_bertha_ticket

Descrição: "Troca por Pokémon Lendário das gerações X-Y (2IVs perfeitos)"

---

## Informações do Servidor

**IP:** cobblebode.bed.ovh
**Versão:** Minecraft 1.21.1 (Fabric)
**Modpack:** Cobblemon + mods personalizados

---

## Deploy

O site roda na infraestrutura Mocha:
- Frontend: React compilado para static assets
- Backend: Cloudflare Workers (serverless)
- Database: Cloudflare D1 (SQLite)
- CDN: Cloudflare
- Domínio: cobblebode.mocha.app

O script de entrega automática roda no Render.com (free tier) conectado ao GitHub repo do cliente.

---

## Problemas Conhecidos e Soluções

### RCON Connection Issues
- Porta 25575 bloqueada por firewall
- Solução: Mudança para porta 25642
- Host inicial: plus-02.bedhosting.com.br:10042
- Host atual: ultra-01.bedhosting.com.br:25642

### Pagamentos Duplicados
- Problema: Idempotency key reutilizada
- Solução: Usar timestamp único em cada requisição

### Orders com product_id NULL
- Problema: Constraint NOT NULL em product_id
- Solução: Usar product_id=0 para compras de itens

### Escaped JSON in RCON
- Problema: Comandos com `{\"text\":...}` quebravam conexão
- Solução: Usar JSON.stringify() para gerar formato correto

---

## Instruções para ChatGPT

Este é um site React/TypeScript completo rodando em Cloudflare Workers com:
- Backend Hono (framework web para Workers)
- Database D1 (SQLite)
- Integração MercadoPago
- Sistema RCON para Minecraft

Para fazer modificações:
1. O backend está em `src/worker/index.ts`
2. As páginas React estão em `src/react-app/pages/`
3. Os componentes estão em `src/react-app/components/`
4. O banco de dados é SQLite (D1) com schema fornecido acima

Limitações do ambiente Mocha:
- Não suporta outras frameworks (Next.js, etc)
- Não suporta outros bancos (PostgreSQL, etc)
- Só roda em Cloudflare Workers
- Secrets são gerenciados via interface Mocha
