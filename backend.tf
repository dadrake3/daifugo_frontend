terraform {
  backend "s3" {
    bucket = "daifugo-frontend-terraform-state"
    key    = "terraform.tfstate"
    region = "us-east-1"
  }
}