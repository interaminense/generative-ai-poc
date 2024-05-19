import React from "react";
import { Tooltip, Legend, PieChart as RechartPieChart, Pie } from "recharts";
import { CHART_COLORS } from "../../utils/constants";

export function PieChart({ data, dataKey, nameKey, height }) {
  return (
    <RechartPieChart width={400} height={height}>
      <Pie
        data={data}
        dataKey={dataKey}
        nameKey={nameKey}
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
        fill={CHART_COLORS[0]}
      />
      <Tooltip />
      <Legend />
    </RechartPieChart>
  );
}
