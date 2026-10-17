# Sistema de Empréstimos de Equipamentos

## 1. Sobre o projeto

Este projeto foi desenvolvido como Trabalho 4 da disciplina de Desenvolvimento de Software. O sistema permite cadastrar usuários, categorias e equipamentos, registrar empréstimos e acompanhar notificações em tempo real.

A aplicação possui uma interface web integrada à API, permitindo visualizar informações e acompanhar as alterações realizadas no sistema.

## 2. Tecnologias utilizadas

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- Socket.IO
- Zod
- Swagger
- HTML, CSS e JavaScript
- Docker e Docker Compose (configuração preparada; execução ainda não validada)

## 3. Funcionalidades

- Cadastro, consulta, atualização e exclusão de usuários.
- Cadastro e gerenciamento de categorias.
- Cadastro e gerenciamento de equipamentos.
- Registro e acompanhamento de empréstimos.
- Gerenciamento de notificações, incluindo a marcação como lida.
- Painel com indicadores do sistema.
- Atualização de informações em tempo real.
- Validação dos dados recebidos pela API com Zod.
- Documentação da API com Swagger.
- Persistência dos dados em banco de dados relacional.
- Utilização de camadas e padrões de projeto para organizar o código.

## 4. Como executar localmente

### Pré-requisitos

- Node.js instalado.
- PostgreSQL instalado e em execução.
- Banco de dados configurado.
- Arquivo `.env` preenchido com as informações de conexão.

### 4.1. Instalação das dependências

Na pasta principal do projeto, execute:

```bash
npm install
```

### 4.2. Configuração do banco de dados

Configure o arquivo `.env` com a variável `DATABASE_URL`, utilizando a URL de conexão correspondente ao seu PostgreSQL.

Exemplo de formato:

```env
DATABASE_URL="postgresql://USUARIO:SENHA@localhost:5432/emprestimos?schema=public"
```

Substitua `USUARIO` e `SENHA` pelos dados configurados no seu ambiente.

### 4.3. Aplicação das migrações

Execute:

```bash
npx prisma migrate deploy
```

Esse comando aplica as migrações existentes ao banco de dados configurado.

### 4.4. Carga inicial de dados

Execute:

```bash
npm run seed
```

Esse comando executa o script de carga inicial definido no projeto.

### 4.5. Inicialização da aplicação

Execute:

```bash
npm start
```

Se a configuração estiver correta, a API será iniciada na porta 3000.

## 5. Acessos

Com a aplicação em execução, os seguintes endereços estarão disponíveis:

- **Painel:** http://localhost:3000
- **Documentação Swagger:** http://localhost:3000/docs
- **Verificação da API:** http://localhost:3000/health

## 6. Rotas principais da API

- `/usuarios`
- `/categorias`
- `/equipamentos`
- `/emprestimos`
- `/notificacoes`

Esses recursos possuem operações de consulta e gerenciamento, conforme implementadas na API. As rotas específicas, os parâmetros e os formatos de requisição podem ser consultados na documentação Swagger.

## 7. Arquitetura do sistema

A aplicação utiliza separação de responsabilidades em camadas:

- **Routes:** definem os endpoints da API.
- **Controllers:** recebem as requisições e retornam as respostas.
- **Services:** implementam as regras de negócio.
- **Repositories:** concentram as operações de persistência.
- **Middlewares e schemas:** auxiliam na validação dos dados e no tratamento das requisições.
- **Socket.IO:** gerencia a comunicação em tempo real.

O projeto também utiliza injeção de dependência, Repository e um cliente Prisma compartilhado. Para mais detalhes sobre as camadas, os padrões de projeto, o diagrama e as decisões arquiteturais, consulte o arquivo `ARQUITETURA.md`.

## 8. Execução com Docker Compose

O projeto possui arquivos de configuração destinados à execução da aplicação e do banco de dados em contêineres.

A execução com Docker Compose ainda precisa ser validada no ambiente utilizado para o desenvolvimento. Portanto, não se considera confirmado que todos os serviços iniciem corretamente em contêineres.

Quando o Docker estiver disponível, a execução deverá ser verificada a partir da pasta principal do projeto, utilizando:

```bash
docker compose up --build
```

Após a inicialização bem-sucedida, devem ser testados o acesso à interface, a API, o banco de dados e a comunicação em tempo real.

## 9. Considerações finais

O Sistema de Empréstimos de Equipamentos busca facilitar o gerenciamento dos equipamentos e dos empréstimos, além de permitir o acompanhamento das alterações por meio de notificações em tempo real.

A organização em camadas e o uso de padrões de projeto contribuem para a separação das responsabilidades e facilitam a manutenção e a evolução do sistema.