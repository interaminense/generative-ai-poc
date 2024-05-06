import React from "react";
import {
  AreaChart as RechartAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";

export function StackedAreaChart({ data, axisX, axisY, numericKeys }) {
  return (
    <RechartAreaChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={axisX} />
      <YAxis dataKey={axisY} />
      <Tooltip />
      <Legend />

      {numericKeys.map((key, index) => (
        <Area
          key={index}
          type="monotone"
          dataKey={key}
          fill={CHART_COLORS[index]}
        />
      ))}
    </RechartAreaChart>
  );
}
