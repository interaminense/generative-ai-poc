import { fetchData } from "../../utils/ai-prompts/BigQueryAnalystPrompt";
import { AC_USERNAME, USER_USERNAME } from "../Chatbot";
import { DataRenderer } from "../data-renderer/DataRenderer";
import { RetryButton } from "./RetryButton";

export async function submitQuestion(options, message, retry, previousQuery) {
  const {
    addConversation,
    dataAnalyst,
    bigQueryAnalyst,
    table,
    setLoadingMessage,
  } = options;

  addConversation({ username: USER_USERNAME, message });

  setLoadingMessage("Working on classify your question ...");

  const isRelevantQuestion = await dataAnalyst.classifyQuestion(message);

  if (isRelevantQuestion.toLowerCase() === "false") {
    const aiMessage = await dataAnalyst.askQuestion(message);

    setLoadingMessage("Still working on it ...");

    addConversation({ username: AC_USERNAME, message: aiMessage });
  } else {
    const query = await bigQueryAnalyst.generateQuery(
      retry
        ? `This query didn't work ${previousQuery}. Try a different one: ${message}`
        : message
    );

    setLoadingMessage(
      "BigQuery analyst is working generating data for you ..."
    );

    const result = await fetchData(table, query);

    if (result.errorMessage) {
      addConversation({
        renderer: {
          Component: RetryButton,
          props: {
            onRetry: () => submitQuestion(options, message, true, query),
          },
        },
        username: AC_USERNAME,
        message:
          "Sorry, I couldn't find any data. You can retry or try a different question.",
      });
    } else {
      const dataStructure = JSON.stringify(result, null, 2);

      addConversation({
        username: AC_USERNAME,
        message: "",
        renderer: {
          Component: DataRenderer,
          props: {
            data: result?.result ?? [],
            dataStructure,
            query,
          },
        },
      });

      setLoadingMessage(
        "Data analyst is saving data on their flash memory ..."
      );

      await dataAnalyst.addContext(dataStructure);
    }
  }

  setLoadingMessage("");
}
