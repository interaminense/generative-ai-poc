import { useState } from "react";
import ClayDropDown from "@clayui/drop-down";
import ClayButton from "@clayui/button";
import { Table } from "./Table";
import ClayIcon from "@clayui/icon";
import { Text } from "@clayui/core";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import ClayToolbar from "@clayui/toolbar";
import ClayModal, { useModal } from "@clayui/modal";
import { marked } from "marked";

export function DataRenderer({ data, dataStructure, query }) {
  const [dataRenderer, setDataRenderer] = useState("table");
  const { observer, onOpenChange, open } = useModal();

  let DataRendererComponent = null;

  switch (dataRenderer) {
    case "table":
      DataRendererComponent = Table;
      break;

    case "bar-chart":
      DataRendererComponent = BarChart;
      break;

    case "pie-chart":
      DataRendererComponent = PieChart;
      break;

    default:
      DataRendererComponent = () => <div>it is not supported yet.</div>;
      break;
  }

  return (
    <div>
      <ClayToolbar className="mb-4">
        <ClayToolbar.Nav>
          <ClayToolbar.Item className="text-left" expand>
            <ClayToolbar.Section>
              <label className="component-title">Data Visualizer</label>
            </ClayToolbar.Section>
          </ClayToolbar.Item>

          <ClayToolbar.Item>
            <ClayDropDown
              className="d-inline-block ml-2"
              closeOnClick
              trigger={
                <ClayButton displayType="secondary">
                  {dataRenderer}

                  <ClayIcon className="ml-2" symbol="caret-bottom" />
                </ClayButton>
              }
            >
              <ClayDropDown.Item onClick={() => setDataRenderer("table")}>
                Table
              </ClayDropDown.Item>
              <ClayDropDown.Item onClick={() => setDataRenderer("bar-chart")}>
                BarChart
              </ClayDropDown.Item>
              <ClayDropDown.Item onClick={() => setDataRenderer("pie-chart")}>
                PieChart
              </ClayDropDown.Item>
            </ClayDropDown>
          </ClayToolbar.Item>

          <ClayToolbar.Item>
            <ClayDropDown
              trigger={
                <ClayButton
                  aria-label="More Actions"
                  title="More Actions"
                  displayType="unstyled"
                  monospaced
                >
                  <ClayIcon symbol="ellipsis-v" />
                </ClayButton>
              }
            >
              <ClayDropDown.Item onClick={() => onOpenChange(true)}>
                <Text>Stats for nerds</Text>
              </ClayDropDown.Item>
            </ClayDropDown>
          </ClayToolbar.Item>
        </ClayToolbar.Nav>
      </ClayToolbar>

      <DataRendererComponent data={data} />

      {open && (
        <StatsForNerdsModal
          onOpenChange={onOpenChange}
          observer={observer}
          dataStructure={dataStructure}
          query={query}
        />
      )}
    </div>
  );
}

const StatsForNerdsModal = ({
  dataStructure,
  observer,
  onOpenChange,
  query,
}) => {
  return (
    <ClayModal className="stats-for-nerds-modal" observer={observer}>
      <ClayModal.Header>
        <ClayModal.Title>Stats for nerd</ClayModal.Title>
      </ClayModal.Header>

      <ClayModal.Body>
        <Text weight="bold">Data Structure</Text>

        <div className="bg-dark text-white rounded mb-4 mt-2 p-4">
          <pre>
            <code>{dataStructure}</code>
          </pre>
        </div>

        <Text weight="bold">BigQuery Query</Text>

        <div
          className="bg-dark text-white rounded mt-2 p-4"
          dangerouslySetInnerHTML={{
            __html: marked.parse(query),
          }}
        />
      </ClayModal.Body>

      <ClayModal.Footer
        last={
          <ClayButton.Group spaced>
            <ClayButton
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
