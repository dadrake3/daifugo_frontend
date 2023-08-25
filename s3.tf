
resource "aws_s3_bucket" "this" {
  bucket = var.domain
}

# resource "aws_s3_bucket_acl" "s3_bucket_acl" {
#   bucket = aws_s3_bucket.this.id
#   acl    = "private"
# }

# resource "aws_s3_bucket_public_access_block" "this" {
#   bucket = aws_s3_bucket.this.id

#   block_public_acls       = true
#   block_public_policy     = true
#   ignore_public_acls      = true
#   restrict_public_buckets = true
# }

resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}


data "aws_iam_policy_document" "this" {
  statement {
    actions = [
      "s3:GetObject"
    ]
    principals {
      # type = "Service"
      # identifiers =  ["cloudfront.amazonaws.com"]
      type        = "AWS"
      identifiers = ["*"]
    }
    resources = [
      "arn:aws:s3:::${var.domain}/*"
    ]
    #   condition {
    #     test = "StringEquals"
    #     values = [
    #       aws_cloudfront_distribution.this.arn
    #     ]

    #   variable = "AWS:SourceArn"
    # }
  }
}


resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id
  policy = data.aws_iam_policy_document.this.json
}


resource "aws_s3_bucket_website_configuration" "this" {

  bucket = aws_s3_bucket.this.bucket
  index_document { suffix = "index.html" }
  # error_document {
  #     key = "404.html"
  # }
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