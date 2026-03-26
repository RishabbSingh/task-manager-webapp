variable "aws_region" {
  description = "AWS region "
  type        = string
  default     = "us-east-1"
}

variable "app_name" {
  description = "Application name used for tagging all resources"
  type        = string
  default     = "task-manager"
}

variable "ami_id" {
  description = "AMI ID for EC2 instance"
  type        = string
  default     = "ami-0261755bbcb8c4a84"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "key_name" {
  description = "AWS key pair name"
  type        = string
}

variable "s3_bucket_name" {
  description = "S3 bucket name"
  type        = string
}
