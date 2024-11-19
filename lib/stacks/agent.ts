import { Construct } from "constructs";
import { bedrock } from "@cdklabs/generative-ai-cdk-constructs";
import * as cdk from "aws-cdk-lib";
import * as path from "path";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";

export class BedrockAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // bedrock knowledge base for the support tickets
    const kb = new bedrock.KnowledgeBase(this, "BedrockKnowledgeBase", {
      embeddingsModel: bedrock.BedrockFoundationModel.TITAN_EMBED_TEXT_V1,
      instruction: `You’re a support engineer assisting customers with technical issues. Offer solutions or guide them to resolve issues independently using the knowledge base with clear and helpful instructions.`,
    }); // todo fix the instruction

    // lambda for the agent - this is the lambda that determines
    // what the prompt looks like with regards to mapping to the schema
    const actionGroupAgentLambda: NodejsFunction = new NodejsFunction(
      this,
      "AgentLambda",
      {
        functionName: "action-group-executor",
        runtime: cdk.aws_lambda.Runtime.NODEJS_20_X,
        entry: "./lib/functions/action-group-executer.ts",
        handler: "handler",
        timeout: cdk.Duration.minutes(1),
        description: "action group lambda function",
        bundling: {
          minify: true,
        },
        environment: {
          NODE_ENV: "production",
        },
      }
    );
    actionGroupAgentLambda.applyRemovalPolicy(cdk.RemovalPolicy.DESTROY);

    // action group
    const agentActionGroup = new bedrock.AgentActionGroup(
      this,
      "AgentActionGroup",
      {
        actionGroupName: "agent-action-group",
        description: "The action group to create a ticket",
        apiSchema: bedrock.S3ApiSchema.fromAsset(
          path.join(__dirname, "../schema/api-schema.json")
        ),
        actionGroupState: "ENABLED",
        actionGroupExecutor: {
          lambda: actionGroupAgentLambda,
        },
      }
    );

    // bedrock agent
    const agent = new bedrock.Agent(this, "BedrockAgent", {
      name: "Agent",
      description: "The agent for tech support.",
      foundationModel:
        bedrock.BedrockFoundationModel.ANTHROPIC_CLAUDE_HAIKU_V1_0,
      instruction: `You are a support engineer, and you need to help users with their support issues. You should be able to search for past tickets an provide insights to the user.`,
      idleSessionTTL: cdk.Duration.minutes(10),
      knowledgeBases: [kb],
      shouldPrepareAgent: true,
      aliasName: "Agent",
      actionGroups: [agentActionGroup],
    });

    new cdk.CfnOutput(this, "KnowledgeBaseIdOutput", {
      value: kb.knowledgeBaseId,
      exportName: "KnowledgeBaseIdOutput",
    });

    new cdk.CfnOutput(this, "KnowledgeBaseArnOutput", {
      value: kb.knowledgeBaseArn,
      exportName: "KnowledgeBaseArnOutput",
    });

    new cdk.CfnOutput(this, "AgentArnOutput", {
      value: agent.agentArn,
      exportName: "AgentArnOutput",
    });

    new cdk.CfnOutput(this, "AgentIdOutput", {
      value: agent.agentId,
      exportName: "AgentIdOutput",
    });

    new cdk.CfnOutput(this, "AgentAliasIdOutput", {
      value: agent.aliasId as string,
      exportName: "AgentAliasIdOutput",
    });
  }
}
