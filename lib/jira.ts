import axios, { AxiosInstance, AxiosResponse } from "axios";

export class JiraService {
  private readonly axiosClient: AxiosInstance;
  constructor() {
    this.axiosClient = axios.create({
      baseURL: process.env.JIRA_BASE_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.JIRA_ACCESS_TOKEN_CREATOR_EMAIL}:${process.env.JIRA_ACCESS_TOKEN}`
        ).toString("base64")}`,
      },
    });
  }

  async fetchJiraTickets(query: string) {
    const response = await this.axiosClient.post<any, AxiosResponse<any>>(
      "/rest/api/2/search",
      {
        jql: `project=${process.env.JIRA_SUPPORT_BOARD_KEY} and status NOT IN (Closed, Done, Resolved) and statusCategory != Done and summary ~ '${query}' or cf[10315] ~ ${query}`,
        fields: ["summary", "status", "comment", "customfield_10315"],
        fieldsByKeys: true,
        maxResults: 15,
        startAt: 0,
      }
    );
    return response.data;
  }
}
