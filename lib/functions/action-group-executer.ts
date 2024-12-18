import middy from "@middy/core";
import { orders, patients } from "../mock/mock-data";
import { JiraService } from "../jira";
import { logger } from "../logger";
import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";

interface Event {
  messageVersion: string;
  agent: {
    name: string;
    id: string;
    alias: string;
    version: string;
  };
  inputText: string;
  sessionId: string;
  actionGroup: string;
  apiPath: string;
  httpMethod: string;
  parameters: {
    name: string;
    type: string;
    value: string;
  }[];
  requestBody: {
    content: {
      [contentType: string]: {
        properties: {
          name: string;
          type: string;
          value: string;
        }[];
      };
    };
  };
  sessionAttributes: Record<string, string>;
  promptSessionAttributes: Record<string, string>;
}
interface Response {
  messageVersion: string;
  response: {
    actionGroup: string;
    apiPath: string;
    httpMethod: string;
    httpStatusCode: number;
    responseBody: {
      [contentType: string]: {
        body: string;
      };
    };
    sessionAttributes?: Record<string, string>;
    promptSessionAttributes?: Record<string, string>;
  };
}

const actionGroupExecutor = async ({
  inputText,
  apiPath,
  httpMethod,
  actionGroup,
  messageVersion,
  sessionAttributes,
  promptSessionAttributes,
  parameters,
}: Event): Promise<Response> => {
  let body;
  let httpStatusCode = 200;

  try {
    logger.info(
      `inputText: ${inputText}, apiPath: ${apiPath}, httpMethod: ${httpMethod}`
    );

    switch (apiPath) {
      case "/patient":
        if (httpMethod === "GET") {
          body = patients[0];
        }
        if (httpMethod === "PUT") {
          body = { ...patients[0], active: 1 };
        }
        break;

      case "/orders":
        if (httpMethod === "GET") {
          body = orders;
        }
        break;

      case "/jira-tickets":
        if (httpMethod === "GET") {
          logger.info("inputText", inputText);
          const value = parameters.length ? parameters[0].value : '';
          body = await new JiraService().fetchJiraTickets(value);
        }
        break;

      default:
        httpStatusCode = 500;
        body =
          "Sorry, I am unable to help you with that. Please try asking the question in a different way perhaps.";
        break;
    }

    return {
      messageVersion,
      response: {
        apiPath,
        actionGroup,
        httpMethod,
        httpStatusCode,
        sessionAttributes,
        promptSessionAttributes,
        responseBody: {
          "application-json": {
            body: JSON.stringify(body),
          },
        },
      },
    };
  } catch (error) {
    let errorMessage = "Unknown error";
    if (error instanceof Error) errorMessage = error.message;
    logger.error(errorMessage);

    throw error;
  }
};
export const handler = middy(actionGroupExecutor).use(injectLambdaContext(logger))
