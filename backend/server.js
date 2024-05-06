const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { BigQuery } = require("@google-cloud/bigquery");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors(), express.json(), bodyParser.urlencoded({ extended: true }));

const projectId = process.env.REACT_APP_PROJECT_ID;
const datasetId = process.env.REACT_APP_DATASET_ID;

const bigquery = new BigQuery({
  keyFilename: "keyfile.json",
  projectId,
});

const bigquerySqlGenerator = new BigQuery({
  keyFilename: "keyfile.json",
  projectId: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID,
});

async function getSchema(dataset, tableId) {
  const table = dataset.table(tableId);
  const result = await table.getMetadata();

  return result[0].schema;
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

app.post("/api/bigquery-generate-query", async (req, res) => {
  const { tableId, query } = req.body;

  if (!tableId || !query) {
    return res.status(400).send("Missing required parameters");
  }

  try {
    const results = await bigquerySqlGenerator.query(query);
    const result = results[0];

    res.json({ result });
  } catch (err) {
    res.status(500).json({ errorMessage: err.message, query });
  }
});

app.listen(
  5000,
  process.env.REACT_APP_EXTERNAL_IP_ADDRESS || "localhost",
  () => {
    console.log("Server listening on port 5000");
  }
);
