output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "subnet_id" {
  description = "Public subnet ID"
  value       = module.vpc.subnet_id
}

output "security_group_id" {
  description = "Security group ID"
  value       = module.security_group.security_group_id
}

output "ec2_public_ip" {
  description = "EC2 instance public IP"
  value       = module.compute.public_ip
}

output "ec2_public_dns" {
  description = "EC2 instance public DNS"
  value       = module.compute.public_dns
}

output "s3_bucket_name" {
  description = "S3 bucket name"
  value       = module.storage.bucket_name
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = module.storage.bucket_arn
}
