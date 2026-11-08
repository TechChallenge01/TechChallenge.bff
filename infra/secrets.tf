resource "aws_secretsmanager_secret" "bff" {
  name                    = "${var.project_name}/bff"
  recovery_window_in_days = 0

  tags = { Name = "bff-secrets" }
}

resource "aws_secretsmanager_secret_version" "bff" {
  secret_id = aws_secretsmanager_secret.bff.id

  secret_string = jsonencode({
    "Jwt__Key" = var.jwt_key
  })
}
