import { Box } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import { differenceInDays, format } from "date-fns";
import React from "react";
import Title from "./Title";
import { Ferment } from "./types";

const FermentItem = ({ ferment }: { ferment: Ferment }) => {
  const startDate = new Date(ferment.startDate);
  const date = format(startDate, "dd MMMM");
  const diff = differenceInDays(new Date(), startDate);
  const s = `${date} (${diff} ${diff === 1 ? "day" : "days"})`;
  return (
    <Box mb={2}>
      <Typography variant="h5" component="h2">
        {ferment.desc}
      </Typography>
      <Typography color="textSecondary">{s}</Typography>
    </Box>
  );
};

type Props = {
  ferments: Ferment[];
};
const Ferments = ({ ferments }: Props) => {
  return (
    <>
      <Title>Current Ferments</Title>
      {ferments.map(f => (
        <FermentItem key={f.desc} ferment={f} />
      ))}
    </>
  );
};

export default Ferments;
