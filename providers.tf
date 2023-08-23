terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    null = {
      source = "hashicorp/null"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region                   = var.region
  shared_credentials_files = ["$HOME/.aws/credentials"]
}

# need this because ssl certs can only be made in us-east-1
provider "aws" {
  region = "us-east-1"
  alias  = "acm_provider"
}