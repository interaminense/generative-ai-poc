import React from "react";
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartPieChart,
  Pie,
} from "recharts";

const BarChart = ({ data }) => {
  const { xKey, yKey } = getFieldKeys(data);

  return (
    <RechartBarChart width={600} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={yKey} fill="#0b5fff" />
    </RechartBarChart>
  );
};

const PieChart = ({ data }) => {
  let nameKey = "";
  let dataKey = "";

  try {
    const keys = Object.keys(data[0]);
    nameKey = keys.find((key) => typeof data[0][key] === "string");
    dataKey = keys.find((key) => typeof data[0][key] === "number");
  } catch (err) {
    throw err;
  }

  return (
    <RechartPieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
        fill="#0b5fff"
      />
      <Tooltip />
      <Legend />
    </RechartPieChart>
  );
};

const CounterChart = ({ data }) => {
  try {
    const key = Object.keys(data[0]);

    return (
      <div>
        <strong>{key[0]}</strong> <span>{data[0][key[0]]}</span>
      </div>
    );
  } catch (err) {
    throw err;
  }
};

export function ChartRenderer({ data, type }) {
  console.log({ type, data });

  switch (type) {
    case "barchart":
      return <BarChart data={data} />;
    case "counter":
      return <CounterChart data={data} />;
    case "piechart":
      return <PieChart data={data} />;
    default:
      return <div>Invalid chart type</div>;
  }
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
