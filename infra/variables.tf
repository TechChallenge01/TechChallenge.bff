variable "aws_region" {
  description = "Região AWS"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Ambiente (prod, staging)"
  type        = string
  default     = "prod"
}

variable "project_name" {
  description = "Deve ser idêntico ao usado no OS Service infra (usado para localizar recursos via data source)"
  type        = string
  default     = "techchallenge"
}

# ─── JWT (único secret do BFF) ────────────────────────────────────────────────

variable "jwt_key" {
  description = "JWT signing key — deve ser igual à usada nos outros serviços"
  type        = string
  sensitive   = true
}

# ─── URLs dos serviços (resolvidas via data sources dos ALBs, exceto Auth) ────

variable "service_url_auth" {
  description = "URL do Auth Service (Lambda API Gateway) — preencher manualmente"
  type        = string
  default     = ""
}

variable "service_url_os" {
  description = "URL do OS Service — resolvida via data source se vazio"
  type        = string
  default     = ""
}

variable "service_url_billing" {
  description = "URL do Billing Service — resolvida via data source se vazio"
  type        = string
  default     = ""
}

variable "service_url_cadastro" {
  description = "URL do Cadastro Service — resolvida via data source se vazio"
  type        = string
  default     = ""
}

variable "service_url_estoque" {
  description = "URL do Estoque Service — resolvida via data source se vazio"
  type        = string
  default     = ""
}

variable "service_url_execucao" {
  description = "URL do Execucao Service — resolvida via data source se vazio"
  type        = string
  default     = ""
}
