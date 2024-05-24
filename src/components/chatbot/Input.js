import { useRef, useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import ClayIcon from "@clayui/icon";

function removePrePrompt(userPrompt) {
  const regex = /\/.*?:.*? /;

  return userPrompt.replace(regex, "");
}

export function Input({ onSubmitPrompt, loading }) {
  const [userPrompt, setUserPrompt] = useState("");
  const [previousUserPrompt, setPreviousUserPrompt] = useState("");

  const inputRef = useRef(null);

  return (
    <div className="prompt-input">
      <ClayForm
        onKeyDown={(event) => {
          if (previousUserPrompt && event.key === "ArrowUp") {
            setUserPrompt(previousUserPrompt);
            setPreviousUserPrompt("");
          }
        }}
        onSubmit={(event) => {
          event.preventDefault();

          const newUserPrompt = removePrePrompt(userPrompt);

          setPreviousUserPrompt(newUserPrompt);
          setUserPrompt("");

          onSubmitPrompt({ userPrompt: newUserPrompt });
        }}
      >
        <ClayInput.Group>
          <ClayInput.GroupItem prepend>
            <ClayInput
              ref={inputRef}
              placeholder="Enter a prompt here"
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
          </ClayInput.GroupItem>
          <ClayInput.GroupItem append shrink>
            <ClayButton
              aria-label="Send"
              type="submit"
              disabled={loading || !removePrePrompt(userPrompt)}
            >
              {loading ? (
                <ClayLoadingIndicator className="d-inline-block mr-2" />
              ) : (
                <ClayIcon symbol="stars" className="d-inline-block mr-2" />
              )}
              Send
            </ClayButton>
          </ClayInput.GroupItem>
        </ClayInput.Group>
      </ClayForm>
    </div>
  );
}
