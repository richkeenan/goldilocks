import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

function App() {
  const [data, setData] = useState<{ time: string; temp: number }[]>([]);
  useEffect(() => {
    fetch("/.netlify/functions/get-temp")
      .then(r => r.json())
      .then(setData)
      .catch(err => console.log(err));
  }, []);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <LineChart width={1000} height={500} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tick={false} />
        <YAxis domain={["dataMin", "dataMax"]} tickCount={20} />
        <Tooltip
          labelFormatter={time =>
            "Time: " + new Date(time).toLocaleTimeString()
          }
        />
        />
        <Line
          isAnimationActive={false}
          name="Temperature /°C"
          type="monotone"
          dataKey="temp"
          stroke="#8884d8"
          dot={false}
        />
      </LineChart>
    </div>
  );
}

export default App;
