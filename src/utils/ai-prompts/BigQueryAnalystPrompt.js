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

    const result = await fetch(`${ENDPOINT}/bigquery-generate-query`, {
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

function generateSchemaPrompt(schema, depth = 0) {
  let prompt = "";

  schema.fields.forEach((field) => {
    prompt += "  ".repeat(depth);
    prompt += `- **${field.name}**: `;
    if (field.fields) {
      prompt += "A subgroup containing fields:\n";
      prompt += generateSchemaPrompt(field, depth + 1);
    } else {
      prompt += `TYPE: ${field.type}`;
      prompt += "\n";
    }
  });

  return prompt;
}

export class BigQueryAnalystPrompt extends BasePrompt {
  async assignRole() {
    const prompt = `
	  You are a bigquery specialist helping users by suggesting a GoogleSQL query that will help them answer their question againsts the provided user question.

	  **projectId:** ${BasePrompt.projectId}
	  **datasetId:** ${BasePrompt.datasetId}
	  **tableId:** ${this.table.id}
    
	  **data base schema:**

    ${generateSchemaPrompt(this.table.schema)}
	  `;

    await this.callConversation(prompt);
  }

  async generateQuery(question) {
    const prompt = `User question: ${question}. Answer with a bigquery sql explicit code only.`;

    return await this.callConversation(prompt);
  }

  async retryQuery({ previousQuery, errorMessage, message }) {
    const prompt = `
      This failed query "${previousQuery}" was caused by this error "${errorMessage}" after the user question "${message}".
      
      You should fix the query and answer with a bigquery sql explicit code only.`;

    return await this.callConversation(prompt);
  }
}
