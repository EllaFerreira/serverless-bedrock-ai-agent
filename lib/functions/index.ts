import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { sendPrompt } from "../common/bedrock";
import { ResponseStream, streamifyResponse } from "lambda-stream";

type Event = {
  prompt: string;
};

export const handler = async ({ body }: APIGatewayProxyEventV2) => {
  try {
    const agentAliasId = process.env.AGENT_ALIAS_ID;
    const agentId = process.env.AGENT_ID;

    if (!agentAliasId || !agentId) {
      throw new Error("Missing agent alias id or agent id");
    }

    console.log("env", process.env.AGENT_ID); // testing env vars

    if (!body) {
      throw new Error("Missing prompt in request body");
    }

    console.log("body", body);
    const { prompt, promptSessionAttributes, sessionAttributes, sessionId } =
      JSON.parse(body);

    const response = await sendPrompt({
      prompt,
      agentAliasId,
      agentId,
      promptSessionAttributes,
      sessionAttributes,
      sessionId,
    });

    if (!response.sessionId) {
      throw new Error("Error processing response.");
    }

    console.log("response", response);

    return {
      statusCode: 200,
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error }) };
  }
};
