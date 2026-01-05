import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';

export class GlamAIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* -------------------- S3 -------------------- */
    const selfiesBucket = new s3.Bucket(this, 'SelfiesBucket', {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    /* ---------------- DynamoDB ------------------ */
    const userFacesTable = new dynamodb.Table(this, 'UserFaces', {
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'uploadId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    /* -------------- Secrets Manager ------------- */
    const openAISecret = new secrets.Secret(this, 'OpenAISecret', {
      secretName: 'glamai/openai',
    });

    /* ---------------- Lambda Role ---------------- */
    const lambdaRole = new iam.Role(this, 'GlamAILambdaRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    lambdaRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        'service-role/AWSLambdaBasicExecutionRole'
      )
    );

    selfiesBucket.grantReadWrite(lambdaRole);
    userFacesTable.grantReadWriteData(lambdaRole);
    openAISecret.grantRead(lambdaRole);

    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        actions: ['rekognition:DetectFaces'],
        resources: ['*'],
      })
    );

    /* ---------------- Lambda Functions ---------------- */
    const commonLambdaProps = {
      runtime: lambda.Runtime.NODEJS_20_X,
      role: lambdaRole,
      timeout: cdk.Duration.seconds(30),
      memorySize: 1024,
      environment: {
        BUCKET: selfiesBucket.bucketName,
        TABLE: userFacesTable.tableName,
        OPENAI_SECRET_ARN: openAISecret.secretArn,
      },
      code: lambda.Code.fromAsset('lambdas'),
    };

    const uploadUrlLambda = new lambda.Function(this, 'UploadUrlLambda', {
      ...commonLambdaProps,
      handler: 'upload-url.handler',
    });

    const analyzeFaceLambda = new lambda.Function(this, 'AnalyzeFaceLambda', {
      ...commonLambdaProps,
      handler: 'analyze-face.handler',
      timeout: cdk.Duration.seconds(60),
      memorySize: 2048,
    });

    const getLooksLambda = new lambda.Function(this, 'GetLooksLambda', {
      ...commonLambdaProps,
      handler: 'get-looks.handler',
    });

    const saveLookLambda = new lambda.Function(this, 'SaveLookLambda', {
      ...commonLambdaProps,
      handler: 'save-look.handler',
    });

    /* ---------------- API Gateway ---------------- */
    const api = new apigateway.RestApi(this, 'GlamAIAPI', {
      restApiName: 'GlamAI Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
      },
    });

    const upload = api.root.addResource('upload-url');
    upload.addMethod('POST', new apigateway.LambdaIntegration(uploadUrlLambda));

    const analyze = api.root.addResource('analyze');
    analyze.addMethod('POST', new apigateway.LambdaIntegration(analyzeFaceLambda));

    const looks = api.root.addResource('looks');
    looks.addResource('{userId}')
      .addMethod('GET', new apigateway.LambdaIntegration(getLooksLambda));

    looks.addResource('save')
      .addMethod('POST', new apigateway.LambdaIntegration(saveLookLambda));

    /* ---------------- Outputs ---------------- */
    new cdk.CfnOutput(this, 'APIUrl', {
      value: api.url,
    });
  }
}
