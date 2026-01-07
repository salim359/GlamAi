import * as cdk from "aws-cdk-lib";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DynamoDBStack extends cdk.Stack {
  public readonly looksTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.looksTable = new dynamodb.Table(this, "GlamAILooksTable", {
      tableName: "GlamAI_Looks",

      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },

      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },

      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,

      timeToLiveAttribute: "ttl",

      removalPolicy: cdk.RemovalPolicy.RETAIN, // SAFE for prod
    });

    // GSI: Fetch latest looks per user
    this.looksTable.addGlobalSecondaryIndex({
      indexName: "GSI1_UserLooksByDate",
      partitionKey: {
        name: "GSI1PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "createdAt",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    new cdk.CfnOutput(this, "LooksTableName", {
      value: this.looksTable.tableName,
    });

    new cdk.CfnOutput(this, "LooksTableArn", {
      value: this.looksTable.tableArn,
    });
  }
}
