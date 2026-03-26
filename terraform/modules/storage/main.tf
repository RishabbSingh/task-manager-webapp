# ---- S3 Bucket ---------------------
resource "aws_s3_bucket" "main" {
  bucket = var.s3_bucket_name

  tags = {
    Name    = "${var.app_name}-storage"
    Project = var.app_name
  }
}

# ----Versioning ----------------------
resource "aws_s3_bucket_versioning" "main" {
  bucket = aws_s3_bucket.main.id

  versioning_configuration {
    status = "Enabled"
  }
}

# ---- Block All Public Access -------------
resource "aws_s3_bucket_public_access_block" "main" {
  bucket = aws_s3_bucket.main.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

