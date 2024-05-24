import ClayIcon from "@clayui/icon";
import { marked } from "marked";
import { AC_USERNAME, USER_USERNAME } from "./Chatbot";
import ClayButton from "@clayui/button";

export function Conversation({ username, message, renderer }) {
  return (
    <>
      {username === AC_USERNAME && (
        <div className="box ai-box d-flex">
          <div className="thumbnail">
            <ClayIcon symbol="ac-logo" />
          </div>

          <div style={{ flex: 1 }}>
            {message && (
              <div
                dangerouslySetInnerHTML={{
                  __html: marked.parse(message),
                }}
              />
            )}

            {renderer && <renderer.Component {...renderer.props} />}

            <div className="d-flex mt-2 ai-options">
              <ClayButton
                aria-label="Download CSV"
                data-tooltip-align="top"
                title="Download CSV"
                size="sm"
                displayType="secondary"
                borderless
                disabled
              >
                <ClayIcon symbol="download" />
              </ClayButton>

              <ClayButton
                aria-label="Copy Text"
                data-tooltip-align="top"
                title="Copy Text"
                size="sm"
                displayType="secondary"
                borderless
                disabled
              >
                <ClayIcon symbol="copy" />
              </ClayButton>

              <ClayButton
                aria-label="Report Issue"
                data-tooltip-align="top"
                title="Report Issue"
                size="sm"
                displayType="secondary"
                borderless
                disabled
              >
                <ClayIcon symbol="thumbs-down" />
              </ClayButton>
            </div>
          </div>
        </div>
      )}

      {username === USER_USERNAME && (
        <div className="box user-box">
          <div className="message">{message}</div>
        </div>
      )}
    </>
  );
}
