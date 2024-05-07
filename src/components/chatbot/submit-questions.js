import { fetchData } from "../../utils/ai-prompts/BigQueryAnalystPrompt";
import { AC_USERNAME, USER_USERNAME } from "./Chatbot";
import { DataRenderer } from "../data-renderer/DataRenderer";
import { RetryButton } from "./RetryButton";

export async function submitQuestion({
  options,
  message,
  query: previousQuery,
  errorMessage,
  retry = false,
}) {
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

  if (isRelevantQuestion.toLowerCase().includes("false")) {
    setLoadingMessage("Still working on it ...");

    const aiMessage = await dataAnalyst.askQuestion(message);

    addConversation({ username: AC_USERNAME, message: aiMessage });
  } else {
    setLoadingMessage(
      "BigQuery analyst is working generating data for you ..."
    );

    let query = null;

    if (retry) {
      query = await bigQueryAnalyst.retryQuery({
        previousQuery,
        errorMessage,
        message,
      });
    } else {
      query = await bigQueryAnalyst.generateQuery(message);
    }

    const result = await fetchData(table, query);

    if (result.errorMessage) {
      addConversation({
        renderer: {
          Component: RetryButton,
          props: {
            query,
            onRetry: () =>
              submitQuestion({
                options,
                message,
                query,
                errorMessage: result.errorMessage,
                retry: true,
              }),
          },
        },
        username: AC_USERNAME,
      });
    } else {
      addConversation({
        username: AC_USERNAME,
        message: "",
        renderer: {
          Component: DataRenderer,
          props: {
            data: result?.result ?? [],
            query,
          },
        },
      });

      setLoadingMessage(
        "Data analyst is saving data on their flash memory ..."
      );

      await dataAnalyst.addContext(JSON.stringify(result, null, 2));
    }
  }

  setLoadingMessage("");
}
