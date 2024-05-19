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
    bigQueryAnalyst,
    command,
    dataAnalyst,
    setLoadingMessage,
    table,
  } = options;

  addConversation({ username: USER_USERNAME, message });

  if (command.value === "conversation") {
    setLoadingMessage("AI Assistant is thinking about it...");

    const aiMessage = await dataAnalyst.askQuestion(message);

    addConversation({
      username: AC_USERNAME,
      message: aiMessage,
    });
  } else {
    setLoadingMessage("AI Assistant is generating data for you...");

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
        username: `${AC_USERNAME} (BigQuery Analyst)`,
      });
    } else {
      setLoadingMessage("AI Assitant is generating a reply about the data...");

      const aiMessage = await dataAnalyst.explainData(
        message,
        JSON.stringify(result?.result ?? [], null, 2)
      );

      addConversation({
        username: AC_USERNAME,
        message: aiMessage,
        renderer: {
          Component: DataRenderer,
          props: {
            data: result?.result ?? [],
            query,
          },
        },
      });
    }
  }

  setLoadingMessage("");
}
