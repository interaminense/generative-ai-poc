# Generative AI POC

This POC application uses cutting-edge technologies such as Gemini, langChain, BigQuery, React, Recharts, and NodeJS.

![Untitled](https://github.com/interaminense/generative-ai-poc/assets/12699849/205ce9aa-868d-4335-83c8-ba75013f0bdd)

This application provides users with seamless access to vast datasets through a user-friendly interface. Powered by advanced AI capabilities, users simply input their desired data queries, and the system autonomously generates SQL queries tailored to their specifications. Leveraging the colossal storage and processing power of BigQuery, the application swiftly retrieves the requested data.

It empowers users with deeper insights into the retrieved data. After executing the SQL query, the AI elucidates the query's structure and purpose, offering users a better understanding of the data retrieval process. The application then visualizes the obtained data in an intuitive bar chart format, crafted using React and Recharts, enabling users to grasp key trends and patterns at a glance.

In summary, our application seamlessly integrates powerful technologies to streamline data access, analysis, and visualization, empowering users to extract meaningful insights effortlessly

https://github.com/interaminense/generative-ai-poc/assets/12699849/77ff748a-6efd-46ec-9b29-4b1d339c16d2

## Getting Start

1. Install packages at root folder `npm install`
2. Start backend at server folder `node server.js`;
3. Star frontend at root folder `npm start`;

## Improvements

1. Well-defined prompts are the key to good AI outcomes. Here's an article that can be used as a reference to create suitable prompts for each database: https://answerrocket.com/resources/leveraging-ai-for-sql-code-generation-guide/.

2. To generate graphics, it's necessary to employ a multifaceted process, combining data, visualizations, and interactivity to present information clearly and concisely. We can use Looker as an example for this. [Learn more here](LOOKER.md).
