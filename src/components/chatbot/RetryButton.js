import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";
import { useState } from "react";

export function RetryButton({ onRetry }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <ClayButton
      displayType="secondary"
      disabled={disabled}
      onClick={() => {
        onRetry();
        setDisabled(true);
      }}
    >
      <ClayIcon symbol="reload" className="mr-2" /> Retry
    </ClayButton>
  );
}
