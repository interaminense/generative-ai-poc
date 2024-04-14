import React, { useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayAlert from "@clayui/alert";
import ClayLoadingIndicator from "@clayui/loading-indicator";

export function Chatbot({ tableId }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  return (
    <div
      style={{
        left: 500,
        position: "fixed",
        overflowX: "auto",
        height: "100%",
        width: "calc(100% - 500px)",
      }}
    >
      <div className="p-5">
        <h2>Chatbot Google Generative AI</h2>

        <ClayForm
          onSubmit={async (e) => {
            e.preventDefault();

            setLoading(true);

            const response = await fetch(
              "http://localhost:5000/api/bigquery-human-question",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  tableId,
                  userPrompt,
                }),
              }
            );

            const data = await response.json();

            setData(data);
            setLoading(false);
          }}
        >
          <ClayInput.Group>
            <ClayInput.GroupItem prepend>
              <ClayInput
                placeholder="Ask a question..."
                type="text"
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
              />
            </ClayInput.GroupItem>
            <ClayInput.GroupItem append shrink>
              <ClayButton type="submit" disabled={!tableId || loading}>
                Send Message
              </ClayButton>
            </ClayInput.GroupItem>
          </ClayInput.Group>
        </ClayForm>

        {loading && (
          <div className="d-flex justify-content-center mt-8">
            <ClayLoadingIndicator
              displayType="primary"
              shape="squares"
              size="md"
            />
          </div>
        )}

        {!loading && !!Object.keys(data).length && (
          <div className="mt-5">
            <div className="mb-4">
              <h4>Generated Query by LangChain JS + Gemini model gemini-pro</h4>
              <pre className="bg-light p-4 rounded">
                {JSON.stringify(data.query, null, 2)}
              </pre>
            </div>

            {!data.errorMessage && (
              <div className="mb-4">
                <h4>Result from BigQuery</h4>
                <pre className="bg-light p-4 rounded">
                  {JSON.stringify(data.result, null, 2)}
                </pre>
              </div>
            )}

            {data.errorMessage && (
              <ClayAlert displayType="danger">
                An Error occurred on query execution: {data.errorMessage}
              </ClayAlert>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
