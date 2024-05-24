import { useEffect, useState } from "react";
import { Text } from "@clayui/core";
import ClayIcon from "@clayui/icon";

export function Suggestions({
  loading: initialLoading = false,
  dataAnalyst,
  onLoadSuggestions,
  onSelectSuggestion,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(initialLoading);

  useEffect(() => {
    async function suggestions() {
      setLoading(true);

      const aiSuggestions = await dataAnalyst.generateSuggestions();

      try {
        setSuggestions(
          aiSuggestions
            .split("\n")
            .filter((suggestion) => suggestion.trim() !== "")
            .map((suggestion) => suggestion.replace(/^\d+\.\s*/, ""))
        );
      } catch (e) {
        console.error(e);

        setSuggestions([]);
      }

      setLoading(false);
    }

    suggestions();
  }, [dataAnalyst]);

  useEffect(() => {
    onLoadSuggestions(loading);
  }, [loading, onLoadSuggestions]);

  return (
    <div className="suggestions">
      {suggestions.map((suggestion, index) => {
        return (
          <div
            className="suggestion"
            key={index}
            onClick={() => onSelectSuggestion(suggestion)}
          >
            <ClayIcon
              className="text-secondary"
              symbol="question-circle"
              style={{ fontSize: 20 }}
            />
            <div className="mt-2">
              <Text>{suggestion}</Text>
            </div>
          </div>
        );
      })}
    </div>
  );
}
