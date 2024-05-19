import ClayDropDown from "@clayui/drop-down";
import ClayButton from "@clayui/button";
import ClayIcon from "@clayui/icon";
import { Text } from "@clayui/core";
import ClayModal, { useModal } from "@clayui/modal";
import { marked } from "marked";

export function StatsForNerds({ dataStructure, query }) {
  const { observer, onOpenChange, open } = useModal();

  return (
    <>
      <ClayDropDown
        trigger={
          <ClayButton
            size="xs"
            aria-label="More Actions"
            title="More Actions"
            displayType="secondary"
            borderless
          >
            <ClayIcon symbol="ellipsis-v" />
          </ClayButton>
        }
      >
        <ClayDropDown.Item onClick={() => onOpenChange(true)}>
          <Text>Stats for nerds</Text>
        </ClayDropDown.Item>
      </ClayDropDown>

      {open && (
        <StatsForNerdsModal
          dataStructure={dataStructure}
          observer={observer}
          onOpenChange={onOpenChange}
          query={query}
        />
      )}
    </>
  );
}

const StatsForNerdsModal = ({
  dataStructure,
  observer,
  onOpenChange,
  query,
}) => {
  return (
    <ClayModal className="stats-for-nerds-modal" observer={observer} size="lg">
      <ClayModal.Header>
        <ClayModal.Title>Stats for nerd</ClayModal.Title>
      </ClayModal.Header>

      <ClayModal.Body>
        {query && (
          <>
            <Text weight="bold">BigQuery Query</Text>

            <div
              className="bg-dark text-white rounded p-4 mb-4"
              dangerouslySetInnerHTML={{
                __html: marked.parse(query),
              }}
            />
          </>
        )}

        {dataStructure && (
          <>
            <Text weight="bold">Data Structure</Text>

            <div className="bg-dark text-white rounded p-4">
              <pre>
                <code>{dataStructure}</code>
              </pre>
            </div>
          </>
        )}
      </ClayModal.Body>

      <ClayModal.Footer
        last={
          <ClayButton.Group spaced>
            <ClayButton
              aria-label="Close"
              displayType="secondary"
              onClick={() => onOpenChange(false)}
            >
              Close
            </ClayButton>
          </ClayButton.Group>
        }
      />
    </ClayModal>
  );
};
