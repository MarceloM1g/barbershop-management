# Barbershop Management

Sistema de gerenciamento para barbearias, desenvolvido para facilitar o controle de clientes, profissionais e agendamentos.

## Tecnologias

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Tailwind CSS

## Funcionalidades

- Cadastro e gerenciamento de clientes
- Gerenciamento de barbeiros
- Agendamento de horários
- Visualização de agendamentos
- Gerenciamento de serviços
- Dashboard para acompanhamento da barbearia

## Instalação

Clone o repositório:

```bash
git clone https://github.com/MarceloM1g/barbershop-management.git
```

Entre na pasta do projeto:

```bash
cd barbershop-management
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente criando um arquivo `.env`:

```env
DATABASE_URL="sua_url_do_banco"
```

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Inicie o projeto:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:3000
```

## Estrutura do projeto

```text
├── app/          # Páginas e rotas da aplicação
├── components/   # Componentes reutilizáveis
├── lib/           # Funções e configurações auxiliares
├── prisma/        # Schema e migrations do banco
├── public/        # Arquivos públicos
└── ...
```

## Status

🚧 Projeto em desenvolvimento.

Novas funcionalidades e melhorias serão adicionadas ao longo do desenvolvimento.

## Autor

Desenvolvido por **MarceloM1g**.

---

⭐ Se este projeto foi útil para você, considere deixar uma estrela no repositório!
