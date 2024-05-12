import { Text } from "@clayui/core";
import ClayIcon from "@clayui/icon";

export function EmptyState({
  command: selectedCommand,
  commands,
  onCommandChange,
}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center mt-8">
      <div className="text-center" style={{ width: 420 }}>
        <div className="mb-4">
          <Text>
            Hi! I'm <strong>AI Analytics Cloud assistent</strong>, and I'm here
            to help you. Please choose an option to start conversation.
          </Text>
        </div>

        <div className="d-flex align-items-center justify-content-center">
          {commands.map((command) => (
            <div
              style={{ width: 200, height: 210, cursor: "pointer" }}
              className={`m-2 sheet m-0 ${
                selectedCommand.value === command.value
                  ? "bg-primary text-white"
                  : ""
              }`}
              key={command.value}
              onClick={() => onCommandChange(command)}
            >
              <div className="d-flex justify-content-center mb-3 mt-1">
                <ClayIcon style={{ fontSize: 60 }} symbol={command.symbol} />
              </div>

              <Text size={6} weight="bold">
                {command.label}
              </Text>
              <p>{command.cardDescription}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
