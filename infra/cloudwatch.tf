resource "aws_cloudwatch_log_group" "bff" {
  name              = "/ecs/bff"
  retention_in_days = 7

  tags = { Name = "bff-logs" }
}
