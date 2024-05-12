import { BarChart } from "./BarChart";
import { LineChart } from "./LineChart";
import { Option, Picker } from "@clayui/core";
import { PieChart } from "./PieChart";
import { StackedAreaChart } from "./StackedAreaChart";
import { StackedBarChart } from "./StackedBarChart";
import { StatsForNerds } from "../StatsForNerds";
import { Table } from "./Table";
import { Text } from "@clayui/core";
import { useState } from "react";
import ClayButton from "@clayui/button";
import ClayDropDown from "@clayui/drop-down";
import ClayIcon from "@clayui/icon";
import ClayToolbar from "@clayui/toolbar";

const dataRenderer = {
  table: {
    Component: Table,
    label: "Table",
    enableConfig: {
      axisX: false,
      axisY: false,
      dataKey: false,
      nameKey: false,
      cog: false,
    },
  },
  "bar-chart": {
    Component: BarChart,
    label: "Bar Chart",
    enableConfig: {
      axisX: true,
      axisY: true,
      dataKey: false,
      nameKey: false,
      cog: true,
    },
  },
  "stacked-bar-chart": {
    Component: StackedBarChart,
    label: "Stacked Bar Chart",
    enableConfig: {
      axisX: true,
      axisY: true,
      dataKey: false,
      nameKey: false,
      cog: true,
    },
  },
  "pie-chart": {
    Component: PieChart,
    label: "Pie Chart",
    enableConfig: {
      axisX: false,
      axisY: false,
      dataKey: true,
      nameKey: true,
      cog: true,
    },
  },
  "line-chart": {
    Component: LineChart,
    label: "Line Chart",
    enableConfig: {
      axisX: true,
      axisY: true,
      dataKey: true,
      nameKey: false,
      cog: true,
    },
  },
  "stacked-area-chart": {
    Component: StackedAreaChart,
    label: "Stacked Area Chart",
    enableConfig: {
      axisX: true,
      axisY: true,
      dataKey: false,
      nameKey: false,
      cog: true,
    },
  },
};

function extractNumericKeys(data) {
  const numericKeysSet = new Set();

  for (const obj of data) {
    for (const key in obj) {
      if (!isNaN(key) || !isNaN(obj[key])) {
        numericKeysSet.add(key);
      }
    }
  }

  return Array.from(numericKeysSet).sort();
}

function extractStringKeys(data) {
  const stringKeysSet = new Set();

  for (const obj of data) {
    for (const key in obj) {
      if (typeof key === "string") {
        stringKeysSet.add(key);
      }
    }
  }

  return Array.from(stringKeysSet);
}

function extractAllKeys(data) {
  const allKeysSet = new Set();

  for (const obj of data) {
    const keys = Object.keys(obj);

    keys.forEach((key) => allKeysSet.add(key));
  }

  return Array.from(allKeysSet);
}

const selectDataRenderer = ({ allKeys, numericKeys, stringKeys }) => {
  if (numericKeys.length > 1) {
    return "stacked-bar-chart";
  }

  if (numericKeys.length === 1) {
    return "bar-chart";
  }

  return "table";
};

export function DataRenderer({ data, query }) {
  const allKeys = extractAllKeys(data);
  const numericKeys = extractNumericKeys(data);
  const stringKeys = extractStringKeys(data);

  const [selectedDataRenderer, setSelectedDataRenderer] = useState(
    selectDataRenderer({ allKeys, numericKeys, stringKeys })
  );

  const [selectedAxisX, setSelectedAxisX] = useState(allKeys[0]);
  const [selectedAxisY, setSelectedAxisY] = useState(numericKeys[0]);
  const [selectedDataKey, setSelectedDataKey] = useState(allKeys[0]);
  const [selectedNameKey, setSelectedNameKey] = useState(stringKeys[0]);

  const DataRendererComponent = dataRenderer[selectedDataRenderer].Component;

  const enableConfig = dataRenderer[selectedDataRenderer].enableConfig;

  return (
    <div>
      <ClayToolbar className="mb-4">
        <ClayToolbar.Nav>
          <ClayToolbar.Item className="text-left" expand>
            <ClayToolbar.Section>
              <Text weight="bold">Data Visualizer</Text>
            </ClayToolbar.Section>
          </ClayToolbar.Item>

          <ClayToolbar.Item>
            <ClayDropDown
              className="d-inline-block ml-2"
              closeOnClick
              trigger={
                <ClayButton aria-label="Data Renderer" displayType="secondary">
                  {dataRenderer[selectedDataRenderer].label}

                  <ClayIcon className="ml-2" symbol="caret-bottom" />
                </ClayButton>
              }
            >
              {Object.keys(dataRenderer).map((key) => (
                <ClayDropDown.Item
                  onClick={() => setSelectedDataRenderer(key)}
                  key={key}
                >
                  {dataRenderer[key].label}
                </ClayDropDown.Item>
              ))}
            </ClayDropDown>
          </ClayToolbar.Item>

          {enableConfig.cog && (
            <ClayToolbar.Item>
              <ClayDropDown
                trigger={
                  <ClayButton
                    title="Configure Chart"
                    data-tooltip-align="top"
                    displayType="secondary"
                    aria-label="Configure Chart"
                  >
                    <ClayIcon symbol="cog" />
                  </ClayButton>
                }
              >
                {enableConfig.axisX && (
                  <ClayDropDown.Item>
                    <Text weight="bold">Axis X</Text>

                    <Picker
                      disabled={!enableConfig.axisX}
                      defaultSelectedKey={selectedAxisX}
                      className="my-2"
                      aria-labelledby="picker-label"
                      id="picker"
                      items={allKeys}
                      placeholder="Select a Axis X"
                      onSelectionChange={(item) => setSelectedAxisX(item)}
                    >
                      {(item) => <Option key={item}>{item}</Option>}
                    </Picker>
                  </ClayDropDown.Item>
                )}

                {enableConfig.axisY && (
                  <ClayDropDown.Item>
                    <Text weight="bold">Axis Y</Text>

                    <Picker
                      defaultSelectedKey={selectedAxisY}
                      className="my-2"
                      aria-labelledby="picker-label"
                      id="picker"
                      items={numericKeys}
                      placeholder="Select a Axis Y"
                      onSelectionChange={(item) => setSelectedAxisY(item)}
                    >
                      {(item) => <Option key={item}>{item}</Option>}
                    </Picker>
                  </ClayDropDown.Item>
                )}

                {enableConfig.dataKey && (
                  <ClayDropDown.Item>
                    <Text weight="bold">Data key</Text>
                    <Picker
                      defaultSelectedKey={selectedDataKey}
                      className="my-2"
                      aria-labelledby="picker-label"
                      id="picker"
                      items={allKeys}
                      placeholder="Select a Axis Y"
                      onSelectionChange={(item) => setSelectedDataKey(item)}
                    >
                      {(item) => <Option key={item}>{item}</Option>}
                    </Picker>
                  </ClayDropDown.Item>
                )}

                {enableConfig.nameKey && (
                  <ClayDropDown.Item>
                    <Text weight="bold">Name key</Text>

                    <Picker
                      defaultSelectedKey={selectedNameKey}
                      className="my-2"
                      aria-labelledby="picker-label"
                      id="picker"
                      items={stringKeys}
                      placeholder="Select a Axis Y"
                      onSelectionChange={(item) => setSelectedNameKey(item)}
                    >
                      {(item) => <Option key={item}>{item}</Option>}
                    </Picker>
                  </ClayDropDown.Item>
                )}
              </ClayDropDown>
            </ClayToolbar.Item>
          )}

          <ClayToolbar.Item>
            <StatsForNerds
              dataStructure={JSON.stringify(data, null, 2)}
              query={query}
            />
          </ClayToolbar.Item>
        </ClayToolbar.Nav>
      </ClayToolbar>

      <DataRendererComponent
        data={data}
        axisX={selectedAxisX}
        axisY={selectedAxisY}
        dataKey={selectedDataKey}
        nameKey={selectedNameKey}
        numericKeys={numericKeys}
        stringKeys={stringKeys}
        allKeys={allKeys}
      />
    </div>
  );
}
