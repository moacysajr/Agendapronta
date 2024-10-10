# Como iniciar o projeto:

O banco de dados é postgresql. Pode usar qualquer banco de dados serveless ou usar a dockerImage disponível no root. Ex: [Neon DB](https://neon.tech/) ou [Supabase](https://supabase.com/)

## 1. Configurar a env de acordo com o .env.example:

```.env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXT_AUTH_SECRET=
NEXTAUTH_URL=
DATABASE_URL=
```

## 2. Configuração do Prisma e Banco de Dados:

Comando para reinicializar o prisma

```bash
npx prisma generate
```

Comando para criar as migrations pendentes

```bash
npx prisma migrate dev --name create tables
```

Comando para executar o seed depois de finalizar sua configuração

```bash
npx prisma db seed
```

## 3. Rodar o projeto:

Instale as dependências com o NPM

```bash
npm install
```

Inicializar o servidor local

```bash
npm run dev
```
