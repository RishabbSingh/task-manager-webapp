# ---- EC2 Instance ----------------
resource "aws_instance" "main" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = var.subnet_id
  vpc_security_group_ids = [var.security_group_id]
  key_name               = var.key_name

  # Root volume - encrypted SSD
  root_block_device {
    volume_type           = "gp3"
    volume_size           = 20
    delete_on_termination = true
    encrypted             = true

    tags = {
      Name    = "${var.app_name}-root-volume"
      Project = var.app_name
    }
  }

  tags = {
    Name    = "${var.app_name}-ec2"
    Project = var.app_name
  }
}
