variable "app_name" {
  description = "Application name for tagging"
  type        = string
}

variable "vpc_id" {
  description = "VPC ID to attach the security group"
  type        = string
}
