const { BigQuery } = require("@google-cloud/bigquery");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");
const { HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const bigqueryToConsultSQL = new BigQuery({
  keyFilename: "keyfile.json",
  projectId: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID,
});

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  model: "gemini-pro",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

async function getSchema(table) {
  const result = await table.getMetadata();

  return result[0].schema;
}

async function generateSQL({ tableId, schema }, userPrompt) {
  const projectId = process.env.REACT_APP_PROJECT_ID;
  const datasetId = process.env.REACT_APP_DATASET_ID;

  const questions = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: "You are a bigquery specialist helping users by suggesting a GoogleSQL query that will help them answer their question againsts the provided context. Do not add ````sql```` and `QUERY` around your answer, reply with the executable code only.",
        },
        {
          type: "text",
          text: userPrompt,
        },
        {
          type: "text",
          text: `projectId: ${projectId}, datasetId: ${datasetId}, tableId ${tableId}`,
        },
        {
          type: "text",
          text: `context: ${JSON.stringify(schema)}`,
        },
      ],
    }),
  ];

  const result = await model.invoke(questions);

  return result.content;
}

async function generateExplanation(query) {
  const questions = [
    new HumanMessage({
      content: [
        {
          type: "text",
          text: "You are a bigquery expert helping users explain a query that the user provides in context and this will help them understand the meaning of the query. Reply with the text in markdown format only.",
        },
        {
          type: "text",
          text: query,
        },
      ],
    }),
  ];

  const result = await model.invoke(questions);

  return result.content;
}

async function executeQuery(query) {
  let result;

  try {
    const results = await bigqueryToConsultSQL.query(query);
    result = results[0];
  } catch (err) {
    throw err;
  }

  return result;
}

module.exports = {
  executeQuery,
  generateExplanation,
  generateSQL,
  getSchema,
};
