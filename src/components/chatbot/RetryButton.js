import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";
import { useState } from "react";
import ClayToolbar from "@clayui/toolbar";
import { Text } from "@clayui/core";
import { StatsForNerds } from "../StatsForNerds";

export function RetryButton({ onRetry, dataStructure, query }) {
  const [disabled, setDisabled] = useState(false);

  return (
    <>
      <ClayToolbar className="mb-4">
        <ClayToolbar.Nav>
          <ClayToolbar.Item className="text-left" expand>
            <Text weight="bold">It's broken :/</Text>
          </ClayToolbar.Item>
          <ClayToolbar.Item>
            <StatsForNerds dataStructure={dataStructure} query={query} />
          </ClayToolbar.Item>
        </ClayToolbar.Nav>
      </ClayToolbar>

      <div className="mb-2">
        <Text>
          Sorry, I couldn't find any data. You can retry or try a different
          question.
        </Text>
      </div>

      <ClayButton
        aria-label="Retry"
        displayType="secondary"
        disabled={disabled}
        onClick={() => {
          onRetry();
          setDisabled(true);
        }}
      >
        <ClayIcon symbol="reload" className="mr-2" /> Retry
      </ClayButton>
    </>
  );
}
