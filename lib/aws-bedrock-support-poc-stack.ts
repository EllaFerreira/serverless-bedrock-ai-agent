import * as cdk from "aws-cdk-lib";
import {
  ApiKey,
  AuthorizationType,
  Cors,
  EndpointType,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { HttpMethod } from "aws-cdk-lib/aws-events";
import { PolicyStatement, Effect } from "aws-cdk-lib/aws-iam";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

const API_ID = "BedrockApi";
const REST_API_NAME = "AWS Bedrock API Gateway Support";
const RESOURCE_NAME = "api";
const bedrockModelArn = process.env.BEDROCK_MODEL_ARN || "";
export class AwsBedrockSupportPocStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Access the context
    const stageName = this.node.tryGetContext("stageName") || "dev";
    console.log(`Stage Name: ${stageName}`);

    // import stack values
    const knowledgeBaseArn = cdk.Fn.importValue("KnowledgeBaseArnOutput");
    const knowledgeBaseId = cdk.Fn.importValue("KnowledgeBaseIdOutput");
    const agentId = cdk.Fn.importValue("AgentIdOutput");
    const agentAliasId = cdk.Fn.importValue("AgentAliasIdOutput");

    //Lambda function
    const func = new NodejsFunction(this, "BedrockFunction", {
      entry: "./lib/functions/index.ts",
      handler: "handler",
      runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
      environment: {
        NODE_ENV: "production",
        KNOWLEDGE_BASE_ARN: knowledgeBaseArn,
        KNOWLEDGE_BASE_ID: knowledgeBaseId,
        AGENT_ID: agentId,
        AGENT_ALIAS_ID: agentAliasId,
      },
      // initialPolicy: [
      //   new PolicyStatement({
      //     effect: Effect.ALLOW,
      //     actions: [
      //       "bedrock:InvokeModel",
      //       "bedrock:RetrieveAndGenerate",
      //       "bedrock:Retrieve",
      //       "bedrock:InvokeAgent",
      //     ],
      //     resources: [bedrockModelArn], // giving access to the bedrock model
      //   }),
      // ],
      timeout: cdk.Duration.seconds(10),
    });

    // post creation policy
    func.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: [
          "bedrock:InvokeModel",
          "bedrock:RetrieveAndGenerate",
          "bedrock:Retrieve",
          "bedrock:InvokeAgent",
        ],
        resources: ['*'], // giving access to the bedrock model
      }),
    )

    // Create an API Gateway
    const api = new RestApi(this, API_ID, {
      restApiName: REST_API_NAME,
      endpointTypes: [EndpointType.REGIONAL],
      deploy: true,
      deployOptions: {
        stageName: stageName,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
    });

    // API Key Setup
    const apiKey = new ApiKey(this, "ApiKey");
    const usagePlan = new UsagePlan(this, "UsagePlan", {
      name: "UsagePlan",
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
    });
    usagePlan.addApiKey(apiKey);
    usagePlan.addApiStage({
      api: api,
      stage: api.deploymentStage,
    });

    // Create a resource
    const rootResource = api.root.addResource(RESOURCE_NAME);
    const aiResource = rootResource.addResource("ai");

    aiResource.addMethod(HttpMethod.POST, new LambdaIntegration(func), {
      apiKeyRequired: true,
      authorizationType: AuthorizationType.NONE,
      methodResponses: [
        {
          statusCode: "200",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
        {
          statusCode: "400",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
        {
          statusCode: "500",
          responseParameters: {
            "method.response.header.Access-Control-Allow-Origin": true,
          },
        },
      ],
    });

    new cdk.CfnOutput(this, "endpoint", {
      value: api.url,
    });
    new cdk.CfnOutput(this, "apiKey", { value: apiKey.keyId });
  }
}
