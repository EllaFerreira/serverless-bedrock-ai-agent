import middy from "@middy/core";
import { orders, patients, tickets } from "../data/mock-data";

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
}: Event): Promise<Response> => {
  let body;
  let httpStatusCode = 200;

  try {
    console.info(
      `inputText: ${inputText}, apiPath: ${apiPath}, httpMethod: ${httpMethod}`
    );

    switch (apiPath) {
      case "/tickets":
        if (httpMethod === "GET") {
          body = tickets;
        } else if (httpMethod === "POST") {
          body = tickets.find((ticket) => ticket.code === "109");
        }
        break;

      case "/patient":
        if (httpMethod === "GET") {
          body = patients[0];
        }
        break;

      case "/orders":
        if (httpMethod === "GET") {
          body = orders;
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
    console.error(errorMessage);

    throw error;
  }
};
export const handler = middy(actionGroupExecutor);
