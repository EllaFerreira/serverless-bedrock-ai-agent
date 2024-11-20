import axios, { AxiosInstance, AxiosResponse } from "axios";
import { config } from "./config";

export class JiraService {
  private readonly axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient = axios.create({
      baseURL: config.JIRA_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${config.JIRA_ACCESS_TOKEN_CREATOR_EMAIL}:${config.JIRA_ACCESS_TOKEN}`
        ).toString("base64")}`,
      },
    });
  }

  async fetchJiraTickets(query: string) {
    const response = await this.axiosClient.post<any, AxiosResponse<any>>(
      "/rest/api/2/search",
      {
        jql: `project=${config.JIRA_SUPPORT_BOARD_KEY} and status NOT IN (Closed, Done, Resolved) and statusCategory != Done and summary ~ '${query}'`,
        fields: ["summary", "status", "comment"],
        fieldsByKeys: true,
        maxResults: 15,
        startAt: 0,
      }
    );
    return response.data;
  }
}
