from typing import Optional
import aws_cdk as cdk
from aws_cdk import (
    Duration,
    aws_s3 as s3,
    aws_iam as iam,
    aws_cloudfront as cloudfront,
    aws_s3_deployment as s3deploy,
)
from constructs import Construct


class WebsiteStack(cdk.Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # TODO: 建立 S3 儲存桶
        # 提示：使用 s3.Bucket，設定為私有（block_public_access），強制 HTTPS
        website_bucket = s3.Bucket(
            self,
            "WebsiteBucket",
            # 請在此填入適當的參數
            # block_public_access=?
            # enforce_ssl=?
            # encryption=?
        )

        # TODO: 建立 CloudFront Origin Access Control (OAC)
        # 提示：使用 cloudfront.CfnOriginAccessControl，設定為 S3 類型，使用 SigV4
        oac = cloudfront.CfnOriginAccessControl(
            self,
            "WebsiteOAC",
            origin_access_control_config=cloudfront.CfnOriginAccessControl.OriginAccessControlConfigProperty(
                # 請填入適當的參數
                # name=?
                # origin_access_control_origin_type=?
                # signing_behavior=?
                # signing_protocol=?
            ),
        )

        # TODO: 建立 CloudFront Distribution
        # 提示：使用 cloudfront.CfnDistribution，設定預設首頁、快取行為、來源
        distribution = cloudfront.CfnDistribution(
            self,
            "WebsiteDistribution",
            distribution_config=cloudfront.CfnDistribution.DistributionConfigProperty(
                # 基本設定
                # enabled=?
                # default_root_object=?
                # http_version=?
                # price_class=?
                
                # 快取行為
                default_cache_behavior=cloudfront.CfnDistribution.DefaultCacheBehaviorProperty(
                    # target_origin_id=?
                    # viewer_protocol_policy=?
                    # allowed_methods=?
                    # cached_methods=?
                    # compress=?
                    # forwarded_values=?
                    # min_ttl=?
                    # default_ttl=?
                    # max_ttl=?
                ),
                
                # 來源設定
                origins=[
                    cloudfront.CfnDistribution.OriginProperty(
                        # domain_name=?
                        # id=?
                        # s3_origin_config=?
                        # origin_access_control_id=?
                    )
                ],
            ),
        )

        # TODO: 建立 CloudFront Distribution ARN
        # 提示：使用 cdk.Fn.join 組合 ARN 字串
        distribution_arn = cdk.Fn.join(
            "",
            [
                # 請填入 ARN 的各個部分
                # "arn:aws:cloudfront::",
                # cdk.Stack.of(self).account,
                # ":distribution/",
                # distribution.attr_id,
            ],
        )

        # TODO: 設定 S3 儲存桶政策，允許 CloudFront 存取
        # 提示：使用 website_bucket.add_to_resource_policy 和 iam.PolicyStatement
        website_bucket.add_to_resource_policy(
            iam.PolicyStatement(
                # sid=?
                # actions=?
                # resources=?
                # principals=?
                # conditions=?
            )
        )

        # TODO: 部署網站資產到 S3
        # 提示：使用 s3deploy.BucketDeployment，來源為 "../website/dist"
        s3deploy.BucketDeployment(
            self,
            "DeployWebsiteAssets",
            # destination_bucket=?
            # sources=?
            # distribution=?
            # distribution_paths=?
        )


