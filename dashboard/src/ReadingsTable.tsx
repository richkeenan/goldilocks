import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Title from "./Title";
import { Reading } from "./types";

type Props = {
  data: Reading[];
};
const ReadingsTable = ({ data }: Props) => {
  return (
    <>
      <Title>Rolling 24 Hr Readings</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Temperature /°C</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {[...data]
            .sort((a, b) => b.time.localeCompare(a.time))
            .map(row => (
              <TableRow key={row.time}>
                <TableCell>{new Date(row.time).toLocaleTimeString()}</TableCell>
                <TableCell>{row.temp.toFixed(2)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ReadingsTable;
