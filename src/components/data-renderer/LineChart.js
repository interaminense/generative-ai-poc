import React from "react";
import {
  LineChart as RechartLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CHART_COLORS } from "../../utils/constants";

export function LineChart({ data, axisX, axisY, dataKey, width, height }) {
  return (
    <RechartLineChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={axisX} />
      <YAxis dataKey={axisY} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey={dataKey} stroke={CHART_COLORS[0]} />
    </RechartLineChart>
  );
}
