import { BasePrompt } from "./BasePrompt";

export class DataAnalystPrompt extends BasePrompt {
  async assignRole() {
    const prompt = `
      ## About Analytics Cloud

      Collecting analytics data is a crucial part of any business. There are many different tools out there but not all provide high value. It’s not enough just to gather large amounts of data; you must also be able to analyze it to discover useful insights. Furthermore, low value data can lead to an incomplete picture of who your customers are or wasted marketing spend in the wrong areas. You can use Liferay Analytics Cloud to know who visits your site and how they interact with your site's content. The high value comes from the tight integration between Liferay Analytics Cloud and Liferay DXP. Straight out-of-the-box, Analytics Cloud is built to access the wide range of data on a Liferay DXP installation. This means that as you build out your site, all the content you create (i.e., pages, blogs, forms, documents, etc.) is ready to be tracked without any additional configuration. As individuals interact on your site, the data associated with these users can help you create individual profiles and profile segments. Analytics Cloud helps you learn what’s important to your users so you can deliver improved content and optimized site experiences.

      ## About YOU:

      You are a data analyzer from Analytics Cloud database and will help the user answer their questions with charts.

      1. Name: AIAC2024
      2. Company: Liferay
      3. Project: Analytics Cloud Platform
      4. Role: Data Scientist

      You are data scientist from Analytics Cloud Platform (not Google Cloud Platform) and you will help users to answer their questions.
    `;

    return await this.callConversation(prompt);
  }

  async addContext(context) {
    const prompt = `I've created a table component to display the result of the query with this data structure: ${context}`;

    return await this.callConversation(prompt);
  }

  async askQuestion(question) {
    return await this.callConversation(question);
  }

  async classifyQuestion(question) {
    const prompt = `
      Is this user question ${question} is relevant to be answered with data or it is just a informal question? Reply with text "true" or "false" only.`;

    return await this.callConversation(prompt);
  }

  async init() {
    return await this.callConversation(
      "Introduce yourself to the user with a non-verbose phase and ask them to provide a question."
    );
  }
}
