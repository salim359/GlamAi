import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";

export default class S3Stack extends cdk.Stack {
  // Public reference to the S3 bucket
  Selfiebucket: s3.Bucket;
  ArAssetsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.Selfiebucket = new s3.Bucket(this, "Uploads", {
      // Allow client side access to the bucket from a different domain
      cors: [
        {
          maxAge: 3000,
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
        },
      ],
    });

    // Export values
    new cdk.CfnOutput(this, "AttachmentsBucketName", {
      value: this.Selfiebucket.bucketName,
    });

    this.ArAssetsBucket = new s3.Bucket(this, "ArAssets", {
      // Allow client side access to the bucket from a different domain
      cors: [
        {
          maxAge: 3000,
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          allowedMethods: [
            s3.HttpMethods.GET,
            s3.HttpMethods.PUT,
            s3.HttpMethods.POST,
            s3.HttpMethods.DELETE,
            s3.HttpMethods.HEAD,
          ],
        },
      ],
    });

    // Export values
    new cdk.CfnOutput(this, "ArAssetsBucketName", {
      value: this.ArAssetsBucket.bucketName,
    });
  }
}
