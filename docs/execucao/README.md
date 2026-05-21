

## Como rodar o projeto:

Clone o Repositório:
```bash
   git clone https://github.com/CRIMS0NC0DE/3DSM-ABP-2026-1.git
```

Dentro da pasta do projeto instale as dependências:
```bash
   cd public
   npm i
   cd ..
   cd server
   npm i
```
Na pasta raiz configure o arquivo ```.env```
```bash
   DATABASE_NAME=
   DATABASE_PASSWORD=
   DATABASE_USER=
   DATABASE_URL=
```

Para inicializar o ambiente (Banco de dados, servidor e front-end)
```bash
   docker compose -f docker-compose.dev.yml up --build -d
```

Para parar os containers

```bash
   docker compose -f docker-compose.dev.yml down
```

Inicialize o servidor e o Prisma
```bash
   npx prisma db pull/ npx prisma generate
   cd server
   npm run dev
```

---

