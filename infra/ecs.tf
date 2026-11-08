locals {
  os_url       = var.service_url_os       != "" ? var.service_url_os       : "http://${data.aws_lb.os_service.dns_name}"
  billing_url  = var.service_url_billing  != "" ? var.service_url_billing  : "http://${data.aws_lb.billing_service.dns_name}"
  cadastro_url = var.service_url_cadastro != "" ? var.service_url_cadastro : "http://${data.aws_lb.cadastro_service.dns_name}"
  estoque_url  = var.service_url_estoque  != "" ? var.service_url_estoque  : "http://${data.aws_lb.estoque_service.dns_name}"
  execucao_url = var.service_url_execucao != "" ? var.service_url_execucao : "http://${data.aws_lb.execucao_service.dns_name}"
}

resource "aws_ecs_task_definition" "bff" {
  family                   = "bff"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = data.aws_iam_role.lab_role.arn
  task_role_arn            = data.aws_iam_role.lab_role.arn

  container_definitions = jsonencode([{
    name      = "bff"
    image     = "${aws_ecr_repository.bff.repository_url}:latest"
    essential = true

    portMappings = [{
      containerPort = 8080
      protocol      = "tcp"
    }]

    environment = [
      { name = "ASPNETCORE_URLS",    value = "http://+:8080" },
      { name = "Services__Auth",     value = var.service_url_auth },
      { name = "Services__OS",       value = local.os_url },
      { name = "Services__Billing",  value = local.billing_url },
      { name = "Services__Cadastro", value = local.cadastro_url },
      { name = "Services__Estoque",  value = local.estoque_url },
      { name = "Services__Execucao", value = local.execucao_url },
      { name = "Jwt__Issuer",        value = "TechChallenger" },
      { name = "Jwt__Audience",      value = "TechChallenger" },
    ]

    secrets = [
      { name = "Jwt__Key", valueFrom = "${aws_secretsmanager_secret.bff.arn}:Jwt__Key::" },
    ]

    logConfiguration = {
      logDriver = "awslogs"
      options = {
        "awslogs-group"         = aws_cloudwatch_log_group.bff.name
        "awslogs-region"        = var.aws_region
        "awslogs-stream-prefix" = "ecs"
      }
    }
  }])

  tags = { Name = "bff" }
}

resource "aws_ecs_service" "bff" {
  name            = "bff"
  cluster         = data.aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.bff.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnets.public.ids
    security_groups  = [data.aws_security_group.ecs.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.bff.arn
    container_name   = "bff"
    container_port   = 8080
  }

  depends_on = [aws_lb_listener.bff]

  lifecycle {
    ignore_changes = [task_definition]
  }
}
