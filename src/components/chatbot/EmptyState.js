import { Text } from "@clayui/core";
import ClayIcon from "@clayui/icon";
import { Suggestions } from "./Suggestions";

export function EmptyState({
  dataAnalyst,
  onLoadSuggestions,
  onSelectSuggestion,
}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-6">
      <div className="mb-4">
        <ClayIcon symbol="ac-logo" style={{ fontSize: 80 }} />
      </div>

      <div className="mb-4 text-center" style={{ maxWidth: 420 }}>
        <Text>
          Hi! I'm{" "}
          <Text weight="bold" size={6}>
            AI Analytics Cloud assistent
          </Text>
          , and I'm here to help you. Please enter a prompt to start
          conversation or select a suggestion from the list below.
        </Text>
      </div>

      <Suggestions
        dataAnalyst={dataAnalyst}
        onLoadSuggestions={onLoadSuggestions}
        onSelectSuggestion={onSelectSuggestion}
      />
    </div>
  );
}
