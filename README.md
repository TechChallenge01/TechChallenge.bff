# TechChallenge.bff — Backend For Frontend

BFF responsável por unificar o acesso a todos os microsserviços e servir o frontend React, parte do sistema TechChallenger (oficina mecânica).

## Responsabilidades

- Proxy reverso para 6 serviços downstream (Auth, OS, Billing, Cadastro, Estoque, Execução)
- Validação de JWT em todos os endpoints protegidos
- 25 endpoints REST mapeados para os serviços
- Serve o frontend React como SPA a partir do `wwwroot/`
- Único ponto de entrada para o frontend

## Arquitetura

- **Backend**: .NET 10 Minimal API com `IHttpClientFactory`
- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Deploy**: Container único com build multi-stage (Node 20 → .NET 10)
- Stateless — escala horizontalmente sem estado compartilhado

## Comunicação

O BFF utiliza comunicação **síncrona (HTTP)** com todos os serviços downstream. A comunicação assíncrona (Saga via RabbitMQ) é responsabilidade exclusiva de cada microsserviço — o BFF não interage com o RabbitMQ.

## Executando localmente

```bash
# Backend
dotnet run --project src/BFF

# Frontend (desenvolvimento com hot reload)
cd frontend
npm install
npm run dev
```

## Variáveis de ambiente

| Variável | Descrição |
|----------|-----------|
| `Jwt__Key` | Chave JWT para validação |
| `Jwt__Issuer` | Issuer JWT (default: `TechChallenger`) |
| `Jwt__Audience` | Audience JWT (default: `TechChallenger`) |
| `Services__Auth` | URL do Auth Service |
| `Services__OS` | URL do OS Service |
| `Services__Billing` | URL do Billing Service |
| `Services__Cadastro` | URL do Cadastro Service |
| `Services__Estoque` | URL do Estoque Service |
| `Services__Execucao` | URL do Execução Service |

Em produção, as URLs dos serviços são injetadas pelo Terraform (ALB DNS names via variáveis de ambiente ECS/K8s).

## Endpoints principais

| Método | Rota | Serviço |
|--------|------|---------|
| `POST` | `/api/auth/login` | Auth — sem JWT obrigatório |
| `POST` | `/api/ordens-servico` | OS Service |
| `GET` | `/api/ordens-servico` | OS Service |
| `GET` | `/api/ordens-servico/{id}` | OS Service |
| `POST` | `/api/orcamentos/{id}/aprovar` | Billing |
| `POST` | `/api/pagamentos/webhook` | Billing |
| `GET` | `/api/produtos` | Cadastro |
| `POST` | `/api/produtos` | Cadastro |
| `GET` | `/api/estoque/{produtoId}` | Estoque |
| `GET` | `/api/execucoes/{id}` | Execução |

## Dockerfile

Build multi-stage:
1. Node 20 — compila React (`npm run build` → `dist/`)
2. .NET SDK 10 — publica BFF com `dist/` copiado para `wwwroot/`
3. .NET Runtime 10 — imagem final (~200MB)

## Kubernetes

Manifestos em `k8s/`:
- `deployment.yaml` — 2 réplicas
- `service.yaml` — ClusterIP porta 80
- `ingress.yaml` — AWS ALB Ingress Controller, internet-facing
- `hpa.yaml` — auto-scaling 2–5 pods

## CI/CD

| Workflow | Trigger | Descrição |
|----------|---------|-----------|
| `deploy.yml` | push main (src/, frontend/, Dockerfile) | Build multi-stage, ECR, ECS deploy |
| `infra.yml` | push main (infra/) | Terraform apply |
| `quality.yml` | push/PR main | Build frontend + SonarCloud backend |
| `k8s-deploy.yml` | manual | Deploy para EKS |

## Testes

```bash
# Frontend
cd frontend && npm run build

# Backend
dotnet test tests/UnitTests
```

Cobertura mínima: **80%** — validada pelo SonarCloud.

**Configuração SonarCloud**: Secret `SONAR_TOKEN`, Variables `SONAR_PROJECT_KEY` e `SONAR_ORGANIZATION`.
