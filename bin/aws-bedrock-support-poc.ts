#!/usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { AwsBedrockSupportPocStack } from '../lib/aws-bedrock-support-poc-stack';
import { BedrockAgentStack } from '../lib/stacks/agent';

const app = new cdk.App();
new BedrockAgentStack(app, 'BedrockAgentStack', {
  // we deploy to ap-southeast-2 region
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});
new AwsBedrockSupportPocStack(app, 'AwsBedrockSupportPocStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.AWS_REGION },
});