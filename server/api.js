const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { BigQuery } = require("@google-cloud/bigquery");
const { convertToGeminiSchema, generateSQL, executeQuery } = require("./utils");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(express.json(), bodyParser.urlencoded({ extended: true }));

app.use(cors());

const projectId = process.env.REACT_APP_PROJECT_ID;
const datasetId = process.env.REACT_APP_DATASET_ID;

const bigquery = new BigQuery({
  keyFilename: "keyfile.json",
  projectId,
});

async function getSchema(dataset, tableId) {
  const table = dataset.table(tableId);
  const schema = await table.getMetadata();
  const geminiSchema = convertToGeminiSchema(schema[0].schema);

  return geminiSchema;
}

app.get("/api/bigquery-table-list", async (req, res) => {
  try {
    const dataset = bigquery.dataset(datasetId);
    const [tables] = await dataset.getTables();

    const tableList = await Promise.all(
      tables.map(async ({ id }) => {
        const schema = await getSchema(dataset, id);

        return { id, schema };
      })
    );

    res.json(tableList);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying BigQuery table list");
  }
});

app.post("/api/bigquery-human-question", async (req, res) => {
  const { tableId, userPrompt } = req.body;

  if (!tableId || !userPrompt) {
    return res.status(400).send("Missing required parameters");
  }

  let query = "";

  try {
    const dataset = bigquery.dataset(datasetId);
    const schema = await getSchema(dataset, tableId);

    query = await generateSQL({ tableId, schema }, userPrompt);

    const result = await executeQuery(query);

    res.json({ result, query });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message, query });
  }
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});
