import React from "react";
import { Tooltip, Legend, PieChart as RechartPieChart, Pie } from "recharts";

export function PieChart({ data }) {
  if (!data || data.length === 0) {
    return null;
  }

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
}
