import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";
import Button from "@material-ui/core/Button";
import Dashboard from "./Dashboard";
function App() {
  // const [data, setData] = useState<{ time: string; temp: number }[]>([]);
  // // useEffect(() => {
  // //   fetch("/.netlify/functions/get-temp")
  // //     .then(r => r.json())
  // //     .then(setData)
  // //     .catch(err => console.log(err));
  // // }, []);
  return <Dashboard />;
}

export default App;
