import * as dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const configSchema = z.object({
  PINECONE_API_KEY: z.string().min(1, "PINECONE_API_KEY is required"),
  PINECONE_CONNECTION_STRING: z
    .string()
    .min(1, "PINECONE_CONNECTION_STRING is required"),
    JIRA_BASE_URL: z.string().min(1, "JIRA_BASE_URL is required"),
    JIRA_SUPPORT_BOARD_KEY: z.string().min(1, "JIRA_SUPPORT_BOARD_KEY is required"),
    JIRA_ACCESS_TOKEN_CREATOR_EMAIL: z.string().min(1, "JIRA_ACCESS_TOKEN_CREATOR_EMAIL is required"),
    JIRA_ACCESS_TOKEN: z.string().min(1, "JIRA_ACCESS_TOKEN is required"),
});

export const validateConfig = () => {
  const result = configSchema.safeParse(process.env);

  if (!result.success) {
    console.log("Error: Environment variables are not set correctly");
    throw new Error(result.error.message);
  }

  return result.data;
};

export const config = validateConfig();
