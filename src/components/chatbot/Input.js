import { useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import ClayIcon from "@clayui/icon";

export function Input({ onSubmitPrompt, loading }) {
  const [userPrompt, setUserPrompt] = useState("");

  return (
    <div className="prompt-input px-10">
      <ClayForm
        onSubmit={(event) => {
          event.preventDefault();

          setUserPrompt("");
          onSubmitPrompt(userPrompt);
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
            <ClayButton
              aria-label="Send Message"
              type="submit"
              disabled={loading || !userPrompt}
            >
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
  );
}
