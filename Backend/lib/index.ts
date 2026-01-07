import * as cdk from "aws-cdk-lib";
import { CognitoStack } from "./cognito";
import S3Stack from "./s3";

interface AppConfig {
    app: cdk.App;
}

export default function main(app: cdk.App): void {
    new CognitoStack(app, "cognito");

    new S3Stack(app, "s3");
}