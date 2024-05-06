import ClayIcon from "@clayui/icon";
import { marked } from "marked";
import { USER_USERNAME } from "./Chatbot";
import { Panel } from "../Panel";

export function Conversation({ username, message, renderer }) {
  const Content = username === USER_USERNAME ? "div" : Panel;

  return (
    <div className="my-5 position-relative">
      <div className="mb-3">
        <div className="thumbnail">
          <ClayIcon symbol={username === USER_USERNAME ? "user" : "ac-logo"} />
        </div>

        <strong className="name">{username}</strong>
      </div>

      <Content>
        {message && (
          <div
            dangerouslySetInnerHTML={{
              __html: marked.parse(message),
            }}
          />
        )}

        {renderer && <renderer.Component {...renderer.props} />}
      </Content>
    </div>
  );
}
