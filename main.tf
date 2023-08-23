resource "aws_s3_bucket" "this" {
  bucket = var.domain
}


resource "aws_s3_bucket_website_configuration" "this" {

  bucket = aws_s3_bucket.this.bucket
  index_document { suffix = "index.html" }
  # error_document {
  #     key = "404.html"
  # }
}


resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls  = true
  ignore_public_acls = true
}


data "aws_iam_policy_document" "this" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      identifiers = ["*"]
      type        = "AWS"
    }
    resources = [
      "arn:aws:s3:::${var.domain}/*"
    ]
  }
}


resource "aws_s3_bucket_policy" "this" {
  depends_on = [data.aws_iam_policy_document.this]
  bucket     = aws_s3_bucket.this.id
  policy     = data.aws_iam_policy_document.this.json
}

# resource "aws_s3_bucket_acl" "this" {
#   bucket = aws_s3_bucket.this.id
#   acl    = "private"
# }



data "aws_route53_zone" "this" {
  name = var.domain
}

resource "aws_route53_record" "this" {
  zone_id = data.aws_route53_zone.this.zone_id
  name    = var.domain
  type    = "A"
  alias {
    name = aws_s3_bucket_website_configuration.this.website_domain
    # name = "s3-website-us-east-1.amazonaws.com"
    zone_id                = aws_s3_bucket.this.hosted_zone_id
    evaluate_target_health = true
  }
}


resource "null_resource" "build_and_deploy" {
  triggers = {
    node_src     = sha1(join("", [for f in fileset(path.module, "src/**") : filesha1(f)]))
    package_json = sha1(file("${path.module}/package.json"))
  }

  provisioner "local-exec" {
    working_dir = "."
    command     = <<EOF
                npm ci && npm run build
                aws s3 sync dist s3://${var.domain} --delete
            EOF
  }

  depends_on = [aws_s3_bucket.this]
}
