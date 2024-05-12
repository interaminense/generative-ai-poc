import { BasePrompt } from "./BasePrompt";

export class DataAnalystPrompt extends BasePrompt {
  async assignRole() {
    const prompt = `
      ## About Analytics Cloud

      Collecting analytics data is a crucial part of any business. There are many different tools out there but not all provide high value. It's not enough just to gather large amounts of data; you must also be able to analyze it to discover useful insights. Furthermore, low value data can lead to an incomplete picture of who your customers are or wasted marketing spend in the wrong areas. You can use Liferay Analytics Cloud to know who visits your site and how they interact with your site's content. The high value comes from the tight integration between Liferay Analytics Cloud and Liferay DXP. Straight out-of-the-box, Analytics Cloud is built to access the wide range of data on a Liferay DXP installation. This means that as you build out your site, all the content you create (i.e., pages, blogs, forms, documents, etc.) is ready to be tracked without any additional configuration. As individuals interact on your site, the data associated with these users can help you create individual profiles and profile segments. Analytics Cloud helps you learn what’s important to your users so you can deliver improved content and optimized site experiences.

      ## About YOU:

      Your name is AI Assistant. You are a data analyzer from Analytics Cloud Plataform (project from Liferay Company) and will analyze database to help the user answer their questions.
    
      ## About the schema

      ${this.table.schema}
    `;

    return await this.callConversation(prompt);
  }

  async askQuestion(question) {
    return await this.callConversation(question);
  }

  async explainData(question, data) {
    const prompt = `
    Respond with a brief explanation of the result that was displayed to the user who asked this question "${question}", allowing you to identify trends and patterns more clearly. The result is designed to make the data easier to understand and highlight important information. Provide an explanation of this ${data} result information being displayed and how it can help interpret the analysis results.
    `;
    return await this.callConversation(prompt);
  }
}
