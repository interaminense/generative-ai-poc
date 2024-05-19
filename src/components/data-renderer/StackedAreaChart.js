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

export function StackedAreaChart({
  data,
  axisX,
  axisY,
  numericKeys,
  width,
  height,
}) {
  return (
    <RechartAreaChart width={width} height={height} data={data}>
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
