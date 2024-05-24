import { useEffect, useRef, useState } from "react";
import { DataAnalystPrompt } from "../../utils/ai-prompts/DataAnalystPrompt";
import {
  BigQueryAnalystPrompt,
  fetchData,
} from "../../utils/ai-prompts/BigQueryAnalystPrompt";
import { Conversation } from "./Conversation";
import { Input } from "./Input";
import { FeedbackMessage } from "./FeedbackMessage";
import { EmptyState } from "./EmptyState";
import { TABLE } from "../../utils/constants";
import { DataRenderer } from "../data-renderer/DataRenderer";
import { Suggestions } from "./Suggestions";
import { RetryButton } from "./RetryButton";

export const AC_USERNAME = "analytics-cloud";
export const USER_USERNAME = "user";

const dataAnalyst = new DataAnalystPrompt(TABLE);
const bigQueryAnalyst = new BigQueryAnalystPrompt(TABLE);

export const Chatbot = () => {
  const [conversation, setConversation] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");

  const chatbotRef = useRef(null);

  useEffect(() => {
    async function init() {
      setLoadingMessage(
        "AI Assitant is hiring the best BigQuery and Data analyst..."
      );

      await bigQueryAnalyst.assignRole();

      setLoadingMessage("");
    }

    init();
  }, []);

  const addConversation = (conversation) => {
    setConversation((prev) => [...prev, { ...conversation }]);

    chatbotRef?.current?.scrollTo(0, chatbotRef?.current?.scrollHeight + 500);
  };

  async function handleSubmit({
    errorMessage,
    previousQuery,
    retry = false,
    userPrompt,
  }) {
    addConversation({ username: USER_USERNAME, message: userPrompt });

    setLoadingMessage("AI Assistant is generating data for you...");

    let query = null;

    if (retry) {
      query = await bigQueryAnalyst.retryQuery({
        previousQuery,
        errorMessage,
        message: userPrompt,
      });
    } else {
      query = await bigQueryAnalyst.generateQuery(userPrompt);
    }

    const result = await fetchData(TABLE, query);

    if (result.errorMessage) {
      addConversation({
        username: AC_USERNAME,
        message:
          "Sorry, I couldn't find any data. You can retry or try a different question.",
        renderer: {
          Component: RetryButton,
          props: {
            onRetry: async () => {
              handleSubmit({
                errorMessage: result.errorMessage,
                previousQuery: query,
                retry: true,
                userPrompt,
              });
            },
            dataStructure: result?.result ?? [],
            query,
          },
        },
      });
    } else {
      setLoadingMessage("AI Assitant is explaining results...");

      const aiMessage = await dataAnalyst.explainData(
        userPrompt,
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

    addConversation({
      username: AC_USERNAME,
      message: "Here are some more prompts I suggest for you:",
      renderer: {
        Component: Suggestions,
        props: {
          dataAnalyst,
          onLoadSuggestions: (loading) =>
            setLoadingMessage(
              loading
                ? "AI Assistant is suggesting some prompts for you..."
                : ""
            ),
          onSelectSuggestion: (userPrompt) => handleSubmit({ userPrompt }),
        },
      },
    });

    setLoadingMessage("");
  }

  return (
    <>
      <div className="chatbot" ref={chatbotRef}>
        <div className="chatbot-content">
          {!conversation.length && (
            <EmptyState
              dataAnalyst={dataAnalyst}
              onLoadSuggestions={(loading) =>
                setLoadingMessage(
                  loading
                    ? "AI Assistant is suggesting some prompts for you..."
                    : ""
                )
              }
              onSelectSuggestion={(userPrompt) => handleSubmit({ userPrompt })}
            />
          )}

          {conversation.map((conversation, index) => (
            <Conversation key={index} {...conversation} />
          ))}
        </div>

        <Input loading={!!loadingMessage} onSubmitPrompt={handleSubmit} />

        {!!loadingMessage && <FeedbackMessage message={loadingMessage} />}
      </div>
    </>
  );
};
