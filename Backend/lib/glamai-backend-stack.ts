import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { Construct } from "constructs";

export class GlamAIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket
    const bucket = new s3.Bucket(this, "SelfieBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // DynamoDB Table
    const table = new dynamodb.Table(this, "UserFaces", {
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "uploadId", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // OpenAI Key in Secrets Manager
    const openAISecret = new secretsmanager.Secret(this, "OpenAIKey");

    // Lambda Factory
    const createLambda = (id: string, handler: string) =>
      new lambda.Function(this, id, {
        runtime: lambda.Runtime.NODEJS_20_X,
        handler,
        code: lambda.Code.fromAsset("lambdas"),
        environment: {
          BUCKET: bucket.bucketName,
          TABLE: table.tableName,
          OPENAI_KEY: openAISecret.secretValue.toString(),
        },
      });

    // Lambdas
    const uploadLambda = createLambda("UploadLambda", "upload-url.handler");
    const analyzeLambda = createLambda("AnalyzeLambda", "analyze-face.handler");
    const getLooksLambda = createLambda("GetLooksLambda", "get-looks.handler");
    const saveLookLambda = createLambda("SaveLookLambda", "save-look.handler");

    // API Gateway
    const api = new apigateway.RestApi(this, "GlamAIAPI", {
      restApiName: "GlamAI Service",
    });

    // Routes
    api.root.addResource("upload-url").addMethod("POST", new apigateway.LambdaIntegration(uploadLambda));
    api.root.addResource("analyze").addMethod("POST", new apigateway.LambdaIntegration(analyzeLambda));
    api.root.addResource("looks").addMethod("GET", new apigateway.LambdaIntegration(getLooksLambda));
    api.root.addResource("looks").addResource("save").addMethod("POST", new apigateway.LambdaIntegration(saveLookLambda));
  }
}
