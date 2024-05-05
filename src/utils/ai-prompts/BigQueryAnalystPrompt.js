import { BasePrompt } from "./BasePrompt";
import { ENDPOINT } from "../constants";

function extractQuery(string) {
  const startIndex = string.indexOf("SELECT");

  if (startIndex === -1) {
    return null;
  }

  const endIndex = string.indexOf(";", startIndex);

  if (endIndex === -1) {
    return null;
  }

  const query = string.substring(startIndex, endIndex + 1);

  return query.trim();
}

export async function fetchData(table, query) {
  let data = {};

  try {
    const extractedQuery = extractQuery(query);

    if (!extractQuery) {
      throw new Error("Invalid query");
    }

    const result = await fetch(`${ENDPOINT}/bigquery-human-question`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableId: table.id,
        query: extractedQuery,
      }),
    });

    data = await result.json();
  } catch (err) {
    return err;
  }

  return data;
}

export class BigQueryAnalystPrompt extends BasePrompt {
  async assignRole() {
    const prompt = `
	  You are a bigquery specialist helping users by suggesting a GoogleSQL query that will help them answer their question againsts the provided user question.

	  **projectId:** ${BasePrompt.projectId}
	  **datasetId:** ${BasePrompt.datasetId}
	  **tableId:** ${this.table.id}
	  **schema:** ${JSON.stringify(this.table.schema)}
	  `;

    await this.callConversation(prompt);
  }

  async generateQuery(question) {
    const prompt = `User question: ${question}. Answer with a bigquery sql explicit code only.`;

    return await this.callConversation(prompt);
  }
}
