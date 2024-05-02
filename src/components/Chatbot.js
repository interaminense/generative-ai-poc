import React, { useEffect, useMemo, useRef, useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayAlert from "@clayui/alert";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import { marked, use } from "marked";
import { ChartRenderer } from "./ChartRenderer";
import { ENDPOINT } from "../utils/constants";
import ClayDropDown from "@clayui/drop-down";
import { Prompts } from "../utils/prompts";
import ReactDOM from "react-dom";
import ClayIcon from "@clayui/icon";

function Setup({ onTableChange }) {
  const [tableList, setTableList] = useState([]);

  function storeTableList(tableList) {
    localStorage.setItem("tableList", JSON.stringify(tableList));
  }

  function getTableListFromStorage() {
    return JSON.parse(localStorage.getItem("tableList"));
  }

  useEffect(() => {
    const tableListFromStorage = getTableListFromStorage();

    if (tableListFromStorage) {
      setTableList(tableListFromStorage);
    } else {
      fetch(`${ENDPOINT}/bigquery-table-list`)
        .then((response) => response.json())
        .then((data) => {
          setTableList(data);
          storeTableList(data.slice(0, 10));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="setup py-10">
      <h4>Select a table before starting</h4>

      <ClayDropDown
        trigger={<ClayButton displayType="secondary">select table</ClayButton>}
        closeOnClick
      >
        {tableList.map((table) => (
          <ClayDropDown.Item
            key={table.id}
            value={table.id}
            onClick={() => {
              const selectedTable = tableList.find(({ id }) => table.id === id);

              onTableChange(selectedTable);
            }}
          >
            {table.id}
          </ClayDropDown.Item>
        ))}
      </ClayDropDown>
    </div>
  );
}

function Conversation({ onConversationChange, table }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [promptList, setPromptList] = useState([]);

  const conversationRef = useRef(null);

  const prompts = useMemo(() => new Prompts(table), [table]);

  useEffect(() => {
    async function fetch() {
      setLoading(true);

      const aiPrompt = await prompts.firstPrompt();

      setPromptList([{ value: aiPrompt, name: "AI" }]);

      setLoading(false);
    }

    fetch();
  }, [prompts]);

  useEffect(() => {
    if (loading) return;

    const conversation = conversationRef.current;
    const sqlNodes = conversation.querySelectorAll("code");

    if (sqlNodes.length) {
      sqlNodes.forEach(async (sqlNode) => {
        const dataStructure = sqlNode.textContent;

        const parentNode = sqlNode.parentNode.parentNode;
        const newNode = document.createElement("div");

        newNode.classList.add("sql-node");

        parentNode.appendChild(newNode);

        sqlNode.remove();

        try {
          ReactDOM.render(
            <div>
              <ClayLoadingIndicator className="d-inline-block mr-1" size="xs" />
              generating chart...
            </div>,
            newNode
          );

          const result = await fetch(`${ENDPOINT}/bigquery-human-question`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tableId: table.id,
              query: dataStructure,
            }),
          });

          const data = await result.json();

          const chartType = await prompts.analyzeDataStructurePrompt({
            data: JSON.stringify(data),
            userPrompt: dataStructure,
          });

          if (data.errorMessage) {
            throw new Error();
          }

          ReactDOM.render(
            <ChartRenderer
              data={data.result}
              type={chartType.replace(" ", "").toLowerCase()}
            />,
            newNode
          );
        } catch (e) {
          ReactDOM.render(
            <ClayAlert displayType="danger" spritemap="/icons.svg">
              Sorry, I couldn't generate a chart!
            </ClayAlert>,
            newNode
          );
        }
      });
    }
  }, [loading, promptList, prompts, table, onConversationChange]);

  useEffect(() => {
    onConversationChange();
  }, [promptList, onConversationChange]);

  return (
    <div
      onClick={async (event) => {
        if (loading) return;

        if (
          event.target.tagName === "LI" ||
          event.target.tagName === "OL" ||
          event.target.parentNode.tagName === "LI" ||
          event.target.parentNode.tagName === "OL"
        ) {
          const userPrompt = event.target.textContent;

          setPromptList([...promptList, { value: userPrompt, name: "YOU" }]);

          setLoading(true);

          const aiPrompt = await prompts.userPrompt({
            prompt: userPrompt,
          });

          setPromptList([
            ...promptList,
            { value: userPrompt, name: "YOU" },
            { value: aiPrompt, name: "AI" },
          ]);

          setLoading(false);
        }
      }}
      id="chat-content"
      ref={conversationRef}
    >
      {!!promptList.length && (
        <div>
          {promptList.map((prompt, index) => {
            return (
              <div key={index} className="my-5 position-relative">
                <div className="mb-3">
                  <div className="thumbnail">
                    <ClayIcon
                      symbol={prompt.name === "YOU" ? "user" : "ac-logo"}
                    />
                  </div>

                  <strong className="name">
                    {prompt.name === "YOU" ? "You" : "Analytics Cloud"}
                  </strong>
                </div>

                <div
                  dangerouslySetInnerHTML={{
                    __html: marked.parse(prompt.value),
                  }}
                />
              </div>
            );
          })}
        </div>
      )}

      {loading && (
        <div className="my-5">
          <ClayLoadingIndicator />
        </div>
      )}

      <div className="prompt-input px-10">
        <ClayForm
          onSubmit={async (event) => {
            event.preventDefault();

            setUserPrompt("");

            setPromptList([...promptList, { value: userPrompt, name: "YOU" }]);

            setLoading(true);

            const aiPrompt = await prompts.userPrompt({
              prompt: userPrompt,
            });

            setPromptList([
              ...promptList,
              { value: userPrompt, name: "YOU" },
              { value: aiPrompt, name: "AI" },
            ]);

            setLoading(false);
          }}
        >
          <ClayInput.Group>
            <ClayInput.GroupItem prepend>
              <ClayInput
                placeholder="Enter a prompt here"
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </ClayInput.GroupItem>
            <ClayInput.GroupItem append shrink>
              <ClayButton type="submit" disabled={loading}>
                {loading ? (
                  <ClayLoadingIndicator className="d-inline-block mr-2" />
                ) : (
                  <ClayIcon symbol="magic" className="d-inline-block mr-2" />
                )}
                Send Message
              </ClayButton>
            </ClayInput.GroupItem>
          </ClayInput.Group>
        </ClayForm>
      </div>
    </div>
  );
}

export function Chatbot({ onTableChange }) {
  const [selectedTable, setSelectedTable] = useState(null);

  const chatbotRef = useRef(null);

  const handleConversationChange = () => {
    console.log(chatbotRef?.current?.scrollHeight);

    chatbotRef?.current?.scrollTo(0, chatbotRef?.current?.scrollHeight);
  };

  return (
    <div className="chatbot px-10 py-5" ref={chatbotRef}>
      {!selectedTable && (
        <Setup
          onTableChange={(table) => {
            setSelectedTable(table);
            onTableChange(table);
          }}
        />
      )}

      {selectedTable && (
        <div>
          <Conversation
            table={selectedTable}
            onConversationChange={handleConversationChange}
          />
        </div>
      )}
    </div>
  );
}
