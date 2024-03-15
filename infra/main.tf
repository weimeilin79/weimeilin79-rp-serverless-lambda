provider "aws" {
  region = "us-east-2" 
}

resource "aws_security_group" "allow_8080" {
  name        = "allow_8080"
  description = "Allow port 8080 inbound traffic"

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1" # Allow all outbound traffic
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "pokemon-ticket-sale" {
  ami           = "ami-0e0bf53f6def86294" # Update this to the AMI ID of your choice; this is an Amazon Linux 2 AMI in us-east-1
  instance_type = "t2.micro" # Choose an instance type
  security_groups = [aws_security_group.allow_8080.name]
  key_name    = "awsec2"
  
  tags = {
    Name = "PokemonTicketSale"
  }
}
