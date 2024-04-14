import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ClayPanel from "@clayui/panel";

export function ChartRenderer({ data }) {
  const { xKey, yKey } = getFieldKeys(data);

  return (
    <ClayPanel
      collapsable
      displayTitle="Generated Chart with React + Recharts BarChart"
      displayType="secondary"
      showCollapseIcon
      expanded
    >
      <ClayPanel.Body className="p-5 d-flex justify-content-center">
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={yKey} fill="#8884d8" />
        </BarChart>
      </ClayPanel.Body>
    </ClayPanel>
  );
}

const getFieldKeys = (data) => {
  if (data.length === 0) return { xKey: "", yKey: "" };

  let xKey = "";
  let yKey = "";

  try {
    const sampleEntry = data[0];
    const keys = Object.keys(sampleEntry);
    const numericKeys = keys.filter(
      (key) => typeof sampleEntry[key] === "number"
    );
    xKey = keys.find((key) => key !== "name");
    yKey = numericKeys.length > 0 ? numericKeys[0] : "";
  } catch (err) {
    throw err;
  }

  return { xKey, yKey };
};
