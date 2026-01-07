import * as cdk from "aws-cdk-lib";
import { GlamAIStack } from '../lib/glamai-backend-stack';

const app = new cdk.App();

new GlamAIStack(app, "GlamAIStack", {
  env: {
    region: "us-east-1",
  },
});
