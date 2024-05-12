import { useEffect, useRef, useState } from "react";
import { DataAnalystPrompt } from "../../utils/ai-prompts/DataAnalystPrompt";
import { BigQueryAnalystPrompt } from "../../utils/ai-prompts/BigQueryAnalystPrompt";
import { Conversation } from "./Conversation";
import { Input } from "./Input";
import { FeedbackMessage } from "./FeedbackMessage";
import { submitQuestion } from "./submit-questions";
import { EmptyState } from "./EmptyState";
import schema from "../../utils/schema.json";

export const AC_USERNAME = "Analytics Cloud";
export const USER_USERNAME = "You";

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

const TABLE = {
  id: process.env.REACT_APP_TABLE_ID,
  schema,
};

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

  return (
    <div className="chatbot px-10 py-6" ref={chatbotRef}>
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

      {!!loadingMessage && <FeedbackMessage message={loadingMessage} />}

      <Input
        onCommandChange={setCommand}
        selectedCommand={command}
        commands={COMMANDS}
        loading={!!loadingMessage}
        onSubmitPrompt={({ userPrompt }) => {
          submitQuestion({
            options: {
              addConversation: (conversation) => {
                setConversation((prev) => [...prev, conversation]);

                chatbotRef?.current?.scrollTo(
                  0,
                  chatbotRef?.current?.scrollHeight
                );
              },
              bigQueryAnalyst,
              command,
              dataAnalyst,
              setLoadingMessage,
              table: TABLE,
            },
            message: userPrompt,
          });
        }}
      />
    </div>
  );
};
