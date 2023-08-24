data "aws_route53_zone" "this" {
  name         = var.domain
  private_zone = false
}


resource "aws_acm_certificate" "default" {
  provider                  = aws.acm_provider
  domain_name               = var.domain
  subject_alternative_names = ["*.${var.domain}"]
  validation_method         = "DNS"
  lifecycle {
    create_before_destroy = true
  }
}


resource "aws_route53_record" "cert_validations" {
  allow_overwrite = true
  depends_on      = [aws_acm_certificate.default]
  count           = 2 #length(aws_acm_certificate.default.domain_validation_options)

  zone_id = data.aws_route53_zone.this.id
  name    = element(aws_acm_certificate.default.domain_validation_options.*.resource_record_name, count.index)
  type    = element(aws_acm_certificate.default.domain_validation_options.*.resource_record_type, count.index)
  records = [element(aws_acm_certificate.default.domain_validation_options.*.resource_record_value, count.index)]
  ttl     = 60
}


resource "aws_acm_certificate_validation" "cert_validations" {
  provider = aws.acm_provider

  certificate_arn         = aws_acm_certificate.default.arn
  validation_record_fqdns = aws_route53_record.cert_validations.*.fqdn
}


resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.this.id
  name    = var.domain
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.this.domain_name
    zone_id                = aws_cloudfront_distribution.this.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.this.id
  name    = "www"
  type    = "A"
  alias {
    name                   = var.domain
    zone_id                = aws_route53_record.root.zone_id
    evaluate_target_health = true
  }
}

# no cloudfront just s3 -> route53 
# resource "aws_route53_record" "this" {
#   zone_id = data.aws_route53_zone.this.zone_id
#   name    = var.domain
#   type    = "A"
#   alias {
#     name = aws_s3_bucket_website_configuration.this.website_domain
#     # name = "s3-website-us-east-1.amazonaws.com"
#     zone_id                = aws_s3_bucket.this.hosted_zone_id
#     evaluate_target_health = true
#   }
# }