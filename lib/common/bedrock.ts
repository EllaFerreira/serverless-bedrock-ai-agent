import {
  BedrockAgentRuntimeClient,
  InvokeAgentCommand,
  InvokeAgentRequest,
  InvokeAgentResponse,
} from "@aws-sdk/client-bedrock-agent-runtime";

const client = new BedrockAgentRuntimeClient();

function parseBase64(message: Uint8Array): string {
  return Buffer.from(message).toString('utf-8');
}

type RequestPayload = {
  sessionAttributes: any;
  promptSessionAttributes: any;
  sessionId: string;
  prompt: string;
  agentId: string;
  agentAliasId: string;
};

export const sendPrompt = async (request: RequestPayload) => {
  try {
    console.log('Request:', request);
    const {
      sessionAttributes,
      promptSessionAttributes,
      sessionId,
      prompt,
      agentId,
      agentAliasId,
    } = request;

    const input: InvokeAgentRequest = {
      sessionState: {
        sessionAttributes,
        promptSessionAttributes,
      },
      agentId,
      agentAliasId,
      sessionId: "123",
      inputText: prompt,
    };

    const command = new InvokeAgentCommand(input);
    const response: InvokeAgentResponse = await client.send(command);

    const chunks = [];
    const completion = response.completion || [];

    for await (const chunk of completion) {
      if (chunk.chunk && chunk.chunk.bytes) {
        const parsed = parseBase64(chunk.chunk.bytes);

        chunks.push(parsed);
      }
    }

    return {
      sessionId: response.sessionId,
      contentType: response.contentType,
      message: chunks.join(' '),
    };
  } catch (error) {
    console.error('error:',error);
    throw error;
  }
};
