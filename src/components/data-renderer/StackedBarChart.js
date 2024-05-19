import React from "react";
import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";

export function StackedBarChart({
  data,
  axisX,
  axisY,
  numericKeys,
  width,
  height,
}) {
  return (
    <RechartBarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={axisX} />
      <YAxis dataKey={axisY} />
      <Tooltip />
      <Legend />

      {numericKeys.map((key, index) => (
        <Bar key={index} dataKey={key} fill={CHART_COLORS[index]} />
      ))}
    </RechartBarChart>
  );
}
