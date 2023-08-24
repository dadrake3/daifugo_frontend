output "route_53_zone_id" {
  value = data.aws_route53_zone.this.zone_id
}
output "bucket_regional_domain_name" {
  value = aws_s3_bucket.this.bucket_regional_domain_name
}
output "bucket_domain_name" {
  value = aws_s3_bucket.this.bucket_domain_name
}
output "website_endpoint" {
  value = aws_s3_bucket_website_configuration.this.website_endpoint
}
output "aws_cloudfront_distribution_id"{
  value = aws_cloudfront_distribution.this.id
}
output "aws_cloudfront_distribution_arn"{
  value = aws_cloudfront_distribution.this.arn
}