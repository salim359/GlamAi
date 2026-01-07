import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as cognito from "aws-cdk-lib/aws-cognito";


export class CognitoStack extends cdk.Stack {
  public readonly userPool: cognito.UserPool;
  public readonly userPoolClient: cognito.UserPoolClient;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //userpool
    this.userPool = new cognito.UserPool(this, "GlamAIUserPool",{
      userPoolName: "GlamAIUserPool",
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true }, // Verify email addresses by sending a verification code
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },  
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
      
    });

    //app client
    this.userPoolClient = new cognito.UserPoolClient(this, "GlamAiClient", {
      userPool: this.userPool,
      generateSecret: false,
      authFlows:{
        userPassword: true, // allows user to signin with username and password directly
        refreshToken: true,
        userSrp: true,// a secure way to authenticate users without sending their password over the network
      }
    });

    //identitty pool
    const identittyPool = new cognito.CfnIdentityPool(this, "GlamAIIdentityPool", {
      allowUnauthenticatedIdentities: false,
      cognitoIdentityProviders: [{
        clientId: this.userPoolClient.userPoolClientId,
        providerName: this.userPool.userPoolProviderName,
      }],
    });

       // Export values
    new cdk.CfnOutput(this, "UserPoolId", {
      value: this.userPool.userPoolId,
    });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: this.userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "IdentityPoolId", {
      value: identittyPool.ref,
    });

  }
}
