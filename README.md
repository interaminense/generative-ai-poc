# Generative AI POC

This POC was created to test the integration between the power of AI (Gemini AI) that generates BigQuery SQL queries and the Google Cloud BigQuery API to request data in the backend and return it as charts in the frontend.

I'm currently using two prompt generators and calling them [BigQueryAnalyst](https://github.com/interaminense/generative-ai-poc/blob/master/src/utils/ai-prompts/BigQueryAnalystPrompt.js) and [DataAnalyst](https://github.com/interaminense/generative-ai-poc/blob/master/src/utils/ai-prompts/DataAnalystPrompt.js), which will be responsible for generating the prompts and structuring the data for the end user asking the question.

## More about it

This application provides users with seamless access to vast datasets through a user-friendly interface. Advanced AI capabilities allow users to input their desired data queries, and the system autonomously generates SQL queries tailored to their specifications. Leveraging the colossal storage and processing power of BigQuery, the application swiftly retrieves the requested data.

It empowers users with deeper insights into the retrieved data. After executing the SQL query, the AI elucidates the query's structure and purpose, offering users a better understanding of the data retrieval process. The application then visualizes the obtained data in an intuitive bar chart format, crafted using React and Recharts, enabling users to grasp key trends and patterns at a glance.

In summary, our application seamlessly integrates powerful technologies to streamline data access, analysis, and visualization, empowering users to extract meaningful insights effortlessly

![Untitled](https://github.com/interaminense/generative-ai-poc/assets/12699849/205ce9aa-868d-4335-83c8-ba75013f0bdd)

## Demo

https://github.com/interaminense/generative-ai-poc/assets/12699849/77ff748a-6efd-46ec-9b29-4b1d339c16d2

## Stack

* Frontend
 - React
 - Recharts
 - ClayUI
 - Gemini API model `gemini-pro`
 - LangChain
* Backend
 - NodeJS
 - Google Clound BigQuery API

## Getting Start

1. To have a Google Cloud Account
2. Add a public bigquery dataset
3. Generate a keyfile.json (https://cloud.google.com/iam/docs/keys-create-delete)
4. Generate a Gemini API key (https://aistudio.google.com/app/apikey)
5. Create a `.env` file at root folder following these variables
```
REACT_APP_GOOGLE_API_KEY=your-api-key
REACT_APP_GOOGLE_CLOUD_PROJECT_ID=your-project-id
REACT_APP_PROJECT_ID=bigquery-public-data
REACT_APP_DATASET_ID=google_analytics_sample
```
6. Install packages at root folder `npm install`
7. Start backend at /server folder `node server.js`;
8. Star frontend at root folder `npm start`;

## Improvements

1. Well-defined prompts are the key to good AI outcomes. Here's an article that can be used as a reference to create suitable prompts for each database: https://answerrocket.com/resources/leveraging-ai-for-sql-code-generation-guide/.

2. To generate graphics, it's necessary to employ a multifaceted process, combining data, visualizations, and interactivity to present information clearly and concisely. We can use Looker as an example for this. [Learn more here](LOOKER.md).
