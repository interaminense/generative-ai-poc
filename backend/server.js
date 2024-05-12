const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const { BigQuery } = require("@google-cloud/bigquery");

const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(cors(), express.json(), bodyParser.urlencoded({ extended: true }));

const bigquery = new BigQuery({
  keyFilename: "keyfile.json",
  projectId: process.env.REACT_APP_GOOGLE_CLOUD_PROJECT_ID,
});

app.post("/api/bigquery-generate-query", async (req, res) => {
  const { tableId, query } = req.body;

  if (!tableId || !query) {
    return res.status(400).send("Missing required parameters");
  }

  try {
    const results = await bigquery.query(query);
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
