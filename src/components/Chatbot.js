import { useEffect, useMemo, useRef, useState } from "react";
import { DataAnalystPrompt } from "../utils/ai-prompts/DataAnalystPrompt";
import { BigQueryAnalystPrompt } from "../utils/ai-prompts/BigQueryAnalystPrompt";
import { Conversation } from "./chatbot/Conversation";
import { Input } from "./chatbot/Input";
import { Setup } from "./chatbot/Setup";
import { FeedbackMessage } from "./chatbot/FeedbackMessage";
import { submitQuestion } from "./chatbot/submit-questions";

export const AC_USERNAME = "Analytics Cloud";
export const USER_USERNAME = "You";

const ChatbotInit = ({ onConversationChange, table }) => {
  const [conversation, setConversation] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState("");

  function addConversation(conversation) {
    setConversation((prev) => [...prev, conversation]);
  }

  const dataAnalyst = useMemo(() => new DataAnalystPrompt(table), [table]);
  const bigQueryAnalyst = useMemo(
    () => new BigQueryAnalystPrompt(table),
    [table]
  );

  useEffect(() => {
    async function init() {
      setLoadingMessage("Hiring the best BigQuery analyst ...");

      await bigQueryAnalyst.assignRole();

      setLoadingMessage("Contacting a professional Data analyst ...");

      await dataAnalyst.assignRole();

      setLoadingMessage("Initializing conversation ...");

      const message = await dataAnalyst.init();

      addConversation({ username: AC_USERNAME, message });

      setLoadingMessage("");
    }

    init();
  }, [dataAnalyst, bigQueryAnalyst]);

  useEffect(() => {
    onConversationChange();
  }, [onConversationChange, conversation]);

  return (
    <>
      {conversation.map((conversation, index) => (
        <Conversation key={index} {...conversation} />
      ))}

      {!!loadingMessage && <FeedbackMessage message={loadingMessage} />}

      <Input
        loading={!!loadingMessage}
        onSubmitPrompt={(message) => {
          submitQuestion(
            {
              table,
              dataAnalyst,
              bigQueryAnalyst,
              addConversation,
              setLoadingMessage,
            },
            message
          );
        }}
      />
    </>
  );
};

export function Chatbot({ onTableChange }) {
  const [selectedTable, setSelectedTable] = useState(null);

  const chatbotRef = useRef(null);

  return (
    <div className="chatbot px-10 py-6" ref={chatbotRef}>
      {selectedTable ? (
        <ChatbotInit
          table={selectedTable}
          onConversationChange={() => {
            chatbotRef?.current?.scrollTo(0, chatbotRef?.current?.scrollHeight);
          }}
        />
      ) : (
        <Setup
          onTableChange={(table) => {
            setSelectedTable(table);
            onTableChange(table);
          }}
        />
      )}
    </div>
  );
}
