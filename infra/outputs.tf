output "bff_url" {
  description = "URL pública do BFF"
  value       = "http://${aws_lb.bff.dns_name}"
}

output "ecr_bff_repository_url" {
  description = "URL do repositório ECR do BFF"
  value       = aws_ecr_repository.bff.repository_url
}
