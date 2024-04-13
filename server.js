const { BigQuery } = require("@google-cloud/bigquery");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const projectId = "home-page-877ff";

const bigquery = new BigQuery({
  keyFilename: "keyfile.json",
  projectId,
});

app.get("/api/bigquery-data", async (req, res) => {
  const query =
    "SELECT author.name FROM `bigquery-public-data.github_repos.commits` GROUP BY author.name ORDER BY COUNT(*) DESC LIMIT 5";

  try {
    const results = await bigquery.query(query);
    const rows = results[0];
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error querying BigQuery");
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
