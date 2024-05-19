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

export const AC_USERNAME = "analytics-cloud";
export const USER_USERNAME = "user";

const COMMANDS = [
  {
    label: "Generate Chart",
    value: "generate",
    cardDescription: "Let me generate charts for you",
    inputDescription: "Enter a prompt and I'm able to generate charts for you",
    symbol: "analytics",
  },
  {
    label: "Chat",
    value: "conversation",
    cardDescription: "Let's have a chat",
    inputDescription: "Enter a prompt and let's have a chat",
    symbol: "message",
  },
];

const dataAnalyst = new DataAnalystPrompt(TABLE);
const bigQueryAnalyst = new BigQueryAnalystPrompt(TABLE);

export const Chatbot = () => {
  const [conversation, setConversation] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [command, setCommand] = useState(COMMANDS[0]);

  const chatbotRef = useRef(null);

  useEffect(() => {
    async function init() {
      setLoadingMessage("AI Assitant is hiring the best BigQuery analyst...");

      await bigQueryAnalyst.assignRole();

      setLoadingMessage(
        "AI Assistant is contacting a professional Data analyst..."
      );

      await dataAnalyst.assignRole();

      setLoadingMessage("");
    }

    init();
  }, []);

  const addConversation = (conversation) => {
    setConversation((prev) => [...prev, { ...conversation }]);

    chatbotRef?.current?.scrollTo(0, chatbotRef?.current?.scrollHeight + 500);
  };

  return (
    <>
      <div className="chatbot" ref={chatbotRef}>
        <div className="chatbot-content">
          {!conversation.length && (
            <EmptyState
              command={command}
              commands={COMMANDS}
              selectedCommand={command}
              onCommandChange={setCommand}
            />
          )}

          {conversation.map((conversation, index) => (
            <Conversation key={index} {...conversation} />
          ))}
        </div>

        <Input
          onCommandChange={setCommand}
          selectedCommand={command}
          commands={COMMANDS}
          loading={!!loadingMessage}
          onSubmitPrompt={async ({ userPrompt }) => {
            addConversation({ username: USER_USERNAME, message: userPrompt });

            if (command.value === "conversation") {
              setLoadingMessage("AI Assistant is thinking about it...");

              const aiMessage = await dataAnalyst.askQuestion(userPrompt);

              addConversation({
                username: AC_USERNAME,
                message: aiMessage,
              });

              setLoadingMessage("");

              return;
            }

            if (command.value === "generate") {
              setLoadingMessage("AI Assistant is generating data for you...");

              const query = await bigQueryAnalyst.generateQuery(userPrompt);

              const result = await fetchData(TABLE, query);

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

              setLoadingMessage("");

              return;
            }
          }}
        />

        {!!loadingMessage && <FeedbackMessage message={loadingMessage} />}
      </div>
    </>
  );
};
