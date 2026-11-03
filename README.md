# Carteira de Aluguel

[![CI](https://github.com/dazevedodev/carteira-app/actions/workflows/ci.yml/badge.svg)](https://github.com/dazevedodev/carteira-app/actions/workflows/ci.yml)

**Gestão de imóveis, contratos e repasses** para quem administra o aluguel de vários proprietários.

No ar em **[carteiradealuguel.com.br](https://carteiradealuguel.com.br)**

![Página inicial da Carteira de Aluguel com o resumo da carteira](docs/inicio.webp)

## O problema

Quem administra o aluguel de várias pessoas (um cliente com 10 casas, outro com 2) se perde em planilhas na hora de cobrar, corrigir o valor e repassar o dinheiro para cada dono. A Carteira de Aluguel organiza a carteira de cada cliente num lugar só e deixa as contas para o sistema.

## O que ele faz

- **Clientes (proprietários):** cada um com a sua carteira de imóveis e a comissão da administração.
- **Imóveis:** cadastro com endereço localizado no mapa, agrupados por endereço (várias casas no mesmo terreno) e com a etiqueta "Em reforma" quando há obra em andamento.
- **Inquilinos e contratos:** contrato com valor, vencimento, índice de reajuste e documentos anexados (foto ou PDF, enviados direto do celular).
- **Pagamentos:** quando o aluguel atrasa, multa, juros e correção são calculados sozinhos, proporcionais aos dias de atraso. Cada pagamento pode ter o comprovante anexado, e a lista pode ser filtrada por cliente.
- **Repasses:** quanto vai para cada proprietário, já descontada a comissão.
- **Índices:** histórico de IGP-M, IPCA e INPC (dados oficiais do Banco Central) para o reajuste dos contratos.
- **Manutenção:** reformas e consertos de cada imóvel, com os itens e o custo total.
- Conta de cada administrador isolada das outras, com login, recuperação de senha, termos e política de privacidade.

![Divulgação da Carteira de Aluguel no celular](docs/capa.webp)

## Stack

| Parte | Tecnologia |
| --- | --- |
| App | Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS 4 |
| Banco e login | Supabase: Postgres com Row Level Security, Auth e Storage |
| Mapa | Leaflet com geocodificação do endereço |
| Hospedagem | Vercel, com uma rotina diária que mantém o projeto do Supabase ativo |

A regra de multa, juros e correção fica em `src/lib/calc.ts`.

## Rodando localmente

```bash
npm install
npm run dev
```

Copie `.env.local.example` para `.env.local` e preencha com a URL e a chave pública do seu projeto Supabase. Rode as migrações de `supabase/migrations/`, em ordem, no SQL Editor do Supabase.

## Estrutura

```
src/app/app/     telas do sistema (clientes, imóveis, inquilinos, pagamentos, índices, manutenção)
src/app/         página inicial, login e páginas legais
src/lib/         cálculos, mapa e armazenamento de arquivos
supabase/        banco e migrações
```

---

Feito por [Daniel D'Azevedo](https://dazevedo.dev) · DAZEVEDO
