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

export function BarChart({ data, axisX, axisY, width, height }) {
  return (
    <RechartBarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={axisX} />
      <YAxis dataKey={axisY} />
      <Tooltip />
      <Legend />
      <Bar dataKey={axisY} fill={CHART_COLORS[0]} />
    </RechartBarChart>
  );
}
