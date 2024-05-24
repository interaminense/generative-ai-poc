import { BasePrompt, generateSchemaPrompt } from "./BasePrompt";

export class DataAnalystPrompt extends BasePrompt {
  async generateSuggestions() {
    const prompt = `
      Based on the schema of the table below, provide a list of three suggested questions that the user can ask. Only return the list with the three suggestions. Nothing else.

      Table schema:

      ${generateSchemaPrompt(this.table.schema)}
    `;

    return await this.callConversation(prompt);
  }

  async explainData(question, data) {
    const prompt = `
      Reply with a brief (non verbose) explanation of the result that was displayed to the user who asked this question "${question}", allowing you to identify trends and patterns more clearly. The result is designed to make the data easier to understand and highlight important information. Provide an explanation of this ${data} result information being displayed and how it can help interpret the analysis results. If the result is empty like [], reply with "No data found".
    `;
    return await this.callConversation(prompt);
  }
}
