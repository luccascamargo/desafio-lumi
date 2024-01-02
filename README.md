# BACKEND

# Projeto Node.js com TypeScript, Prisma e Express.js

Bem-vindo ao meu projeto Node.js! Este projeto utiliza TypeScript como linguagem principal, Prisma como ORM (Object-Relational Mapping) para interação com o banco de dados, e Express.js como framework para desenvolvimento da API.

## Configuração do Ambiente

Certifique-se de ter o Node.js instalado na sua máquina. Você pode baixá-lo em [nodejs.org](https://nodejs.org/).

### Instalação de Dependências

Execute o seguinte comando para instalar as dependências do projeto:

```bash
npm install
```

## Configuração do Banco de Dados

Este projeto utiliza o Prisma como ORM para interação com o banco de dados. Certifique-se de configurar o arquivo .env com as informações corretas do seu banco de dados. Um exemplo de arquivo .env pode ser encontrado em .env.example.

Depois de configurar o arquivo .env, execute o seguinte comando para aplicar as migrações do Prisma:

```bash
npx prisma migrate dev
```

## Executando o Projeto

Após a instalação das dependências e configuração do banco de dados, você pode iniciar o servidor com o seguinte comando:

```bash
npm run start:dev
```

O servidor estará acessível em http://localhost:3000.

# FRONTEND

### Instalação de Dependências

Execute o seguinte comando para instalar as dependências do projeto:

```bash
npm install
```

## Executando o Projeto

Após a instalação das dependências, você pode iniciar o servidor com o seguinte comando:

```bash
npm run dev
```

O servidor estará acessível em http://localhost:3000.
