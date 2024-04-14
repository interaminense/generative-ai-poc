const readline = require("readline");
require("dotenv").config();

const { BigQuery } = require("@google-cloud/bigquery");
const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { HumanMessage } = require("@langchain/core/messages");
const { HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const { convertToGeminiSchema } = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-pro",
  maxOutputTokens: 2048,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const projectId = "bigquery-public-data";
const datasetId = "github_repos";
const tableId = "commits";

const bigquery = new BigQuery({
  keyFilename: "keyfile.json",
  projectId,
});

const bigqueryToConsultSQL = new BigQuery({
  keyFilename: "keyfile.json",
  projectId: "home-page-877ff",
});

const dataset = bigquery.dataset(datasetId);
const table = dataset.table(tableId);

async function getSchema() {
  const schema = await table.getMetadata();
  const geminiSchema = convertToGeminiSchema(schema[0].schema);

  console.log(geminiSchema);

  return geminiSchema;
}

async function generateSQL(schema, userPrompt) {
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

async function executeQuery(query) {
  console.log("QUERY", query);

  let result;

  try {
    const results = await bigqueryToConsultSQL.query(query);
    result = results[0];

    rl.close();
  } catch (err) {
    console.log("ERROR!!");

    rl.close();
  }

  return result;
}

async function init() {
  const schema = await getSchema();

  rl.question("Add your prompt: ", async (userPrompt) => {
    const query = await generateSQL(schema, userPrompt);
    const result = await executeQuery(query);

    console.log(result);
  });
}

init();
