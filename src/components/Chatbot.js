import React, { useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayAlert from "@clayui/alert";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import ClayPanel from "@clayui/panel";
import { marked } from "marked";
import { ChartRenderer } from "./ChartRenderer";

export function Chatbot({ tableId }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [explainedQuery, setExplainedQuery] = useState("");

  return (
    <div
      className="p-5"
      style={{
        left: 500,
        position: "fixed",
        overflowX: "auto",
        height: "100%",
        width: "calc(100% - 500px)",
      }}
    >
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

          const responseExplainedQuery = await fetch(
            "http://localhost:5000/api/bigquery-query-explanation",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                query: data.query,
              }),
            }
          );

          const explainedQuery = await responseExplainedQuery.json();

          setExplainedQuery(explainedQuery.result);

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
          <ClayPanel
            displayTitle="Generated Query by LangChain JS + Gemini model gemini-pro"
            displayType="secondary"
            showCollapseIcon
            collapsable
            expanded
          >
            <ClayPanel.Body>
              <pre className="bg-light p-4 rounded">
                {JSON.stringify(data.query, null, 2)}
              </pre>

              <div
                className="explained-query p-3 rounded bg-dark text-light"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(explainedQuery),
                }}
              />
            </ClayPanel.Body>
          </ClayPanel>

          {!data.errorMessage && (
            <>
              <ClayPanel
                collapsable
                displayTitle="Result from BigQuery"
                displayType="secondary"
                showCollapseIcon
              >
                <ClayPanel.Body>
                  <pre className="bg-light p-4 rounded">
                    {JSON.stringify(data.result, null, 2)}
                  </pre>
                </ClayPanel.Body>
              </ClayPanel>

              <ChartRenderer data={data.result} />
            </>
          )}

          {data.errorMessage && (
            <ClayAlert displayType="danger">
              An Error occurred on query execution: {data.errorMessage}
            </ClayAlert>
          )}
        </div>
      )}
    </div>
  );
}
