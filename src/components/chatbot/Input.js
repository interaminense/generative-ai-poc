import { useRef, useState } from "react";
import ClayButton from "@clayui/button";
import ClayForm, { ClayInput } from "@clayui/form";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import ClayIcon from "@clayui/icon";
import ClayDropDown, { Align } from "@clayui/drop-down";

function removePrePrompt(userPrompt) {
  const regex = /\/.*?:.*? /;

  return userPrompt.replace(regex, "");
}

export function Input({
  selectedCommand,
  commands,
  onCommandChange,
  onSubmitPrompt,
  loading,
}) {
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
          <ClayInput.GroupItem shrink>
            <ClayDropDown
              trigger={
                <ClayButton displayType="secondary">
                  {selectedCommand.label} <ClayIcon symbol="caret-bottom" />
                </ClayButton>
              }
              alignmentPosition={Align.TopLeft}
            >
              {commands.map((command) => (
                <ClayDropDown.Item
                  key={command.value}
                  value={command.value}
                  onClick={() => onCommandChange(command)}
                >
                  {command.label}
                </ClayDropDown.Item>
              ))}
            </ClayDropDown>
          </ClayInput.GroupItem>
          <ClayInput.GroupItem prepend>
            <ClayInput
              ref={inputRef}
              placeholder={selectedCommand.inputDescription}
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
            />
          </ClayInput.GroupItem>
          <ClayInput.GroupItem append shrink>
            <ClayButton
              aria-label="Send Message"
              type="submit"
              disabled={loading || !removePrePrompt(userPrompt)}
            >
              {loading ? (
                <ClayLoadingIndicator className="d-inline-block mr-2" />
              ) : (
                <ClayIcon symbol="stars" className="d-inline-block mr-2" />
              )}
              Send Message
            </ClayButton>
          </ClayInput.GroupItem>
        </ClayInput.Group>
      </ClayForm>
    </div>
  );
}
