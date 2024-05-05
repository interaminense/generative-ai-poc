import ClayLoadingIndicator from "@clayui/loading-indicator";
import { Text } from "@clayui/core";

export function FeedbackMessage({ message }) {
  return (
    <div className="feedback-message">
      <ClayLoadingIndicator key="loading" className="d-inline-block mr-2" />

      <Text weight="bold">{message}</Text>
    </div>
  );
}
