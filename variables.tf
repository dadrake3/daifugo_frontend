variable "aws_credentials_profile" {
  default = "default"
}

variable "region" {
  default = "us-east-1"
}

variable "prefix" {
  default = "daifugo_frontend"
}

variable "bucket_name" {
  #   default = "daifugo-frontend-bucket"
  default = "daifugo.xyz"
  # type = string
}

variable "domain" {
  default = "daifugo.xyz"
}