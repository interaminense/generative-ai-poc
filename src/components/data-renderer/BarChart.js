import {
  BarChart as RechartBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

function getFieldKeys(data) {
  if (!data || data.length === 0) {
    return { xKey: "", yKey: "" };
  }

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
}

export function BarChart({ data }) {
  const { xKey, yKey } = getFieldKeys(data);

  return (
    <RechartBarChart width={800} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey={xKey} />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey={yKey} fill="#0b5fff" />
    </RechartBarChart>
  );
}
