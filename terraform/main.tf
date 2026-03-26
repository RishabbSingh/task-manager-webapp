terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

#--- Networking ------------------------
module "vpc" {
  source     = "./modules/vpc"
  app_name   = var.app_name
  aws_region = var.aws_region
}

# ─--- Security Group -----------------------
module "security_group" {
  source   = "./modules/security_group"
  app_name = var.app_name
  vpc_id   = module.vpc.vpc_id
}

# ---- Compute ----------------------------
module "compute" {
  source            = "./modules/compute"
  app_name          = var.app_name
  ami_id            = var.ami_id
  instance_type     = var.instance_type
  key_name          = var.key_name
  subnet_id         = module.vpc.subnet_id
  security_group_id = module.security_group.security_group_id
}

# --- Storage --------------------------
module "storage" {
  source         = "./modules/storage"
  app_name       = var.app_name
  s3_bucket_name = var.s3_bucket_name
}
