# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

## AWS CDK

1. Bootstrap Your AWS Account (Important – Only needed once per account/region):

Before deploying your first CDK stack to a specific AWS region, you need to bootstrap that region. This sets up the necessary resources in your AWS account for CDK to work. Run this command, replacing REGION with your desired AWS region (e.g., us-east-1, eu-west-1):

Ensure docker is running.

```bash
cdk bootstrap aws://ACCOUNT_ID/REGION
```

2. Synthesize Your Stack

To synthesize your stack and generate the CloudFormation template, run the following command:

```bash
cdk synth
```

This creates a CloudFormation template in a .cdk.out directory. This step is optional, but it helps you inspect the generated infrastructure as code.

3. Deploy Your Stack

To deploy your stack to your default AWS account/region, run the following command:

```bash
cdk deploy
```

The CDK toolkit will prompt you to confirm the deployment. Review the changes carefully before proceeding.

## Destroy Your Stack (Optional: Only needed if you want to destroy the stack)

To destroy your stack and remove all resources from your AWS account/region, run the following command:

```bash
cdk destroy
```