import React from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  LineChart,
  Line,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  ReferenceLine
} from "recharts";
import Title from "./Title";
import { Reading } from "./types";

type Props = {
  data: Reading[];
};
const Chart = ({ data }: Props) => {
  const theme = useTheme();

  if (data.length === 0) return null;

  const min = Math.floor(Math.min(...data.map(d => d.temp))) - 1;
  const max = Math.ceil(Math.max(...data.map(d => d.temp))) + 1;
  const length = max - min + 1;
  const ticks = new Array(length).fill(0).map((_, i) => i + min);

  return (
    <React.Fragment>
      <Title>Rolling 24 Hr Readings</Title>
      <ResponsiveContainer>
        <LineChart data={data}>
          <YAxis
            ticks={ticks}
            domain={[min, max]}
            stroke={theme.palette.text.secondary}
          ></YAxis>

          <XAxis dataKey="time" tick={false} />

          <Tooltip
            labelFormatter={l =>
              `Time of day: ${new Date(l).toLocaleTimeString()}`
            }
          />
          <Line
            name="Temperature /°C"
            isAnimationActive={false}
            type="monotone"
            dataKey="temp"
            strokeWidth={2}
            stroke={theme.palette.primary.main}
            dot={false}
          />

          <ReferenceLine strokeDasharray="3 3" y={21} stroke="orange" />
          <ReferenceLine strokeDasharray="3 3" y={19} stroke="orange" />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default Chart;
