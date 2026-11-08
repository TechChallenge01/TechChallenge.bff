resource "aws_ecr_repository" "bff" {
  name                 = "${var.project_name}-bff"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = { Name = "bff" }
}

resource "aws_ecr_lifecycle_policy" "bff" {
  repository = aws_ecr_repository.bff.name

  policy = jsonencode({
    rules = [{
      rulePriority = 1
      description  = "Manter apenas as últimas 5 imagens"
      selection = {
        tagStatus   = "any"
        countType   = "imageCountMoreThan"
        countNumber = 5
      }
      action = { type = "expire" }
    }]
  })
}
