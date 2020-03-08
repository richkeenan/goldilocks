import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { differenceInDays, format } from "date-fns";
import React from "react";
import Title from "./Title";
import { Ferment } from "./types";

const FermentItem = ({ ferment }: { ferment: Ferment }) => {
  const startDate = new Date(ferment.startDate);
  const date = format(startDate, "dd MMM");
  const diff = differenceInDays(new Date(), startDate);
  const s = `${date} (${diff} days)`;
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2">
          {ferment.desc}
        </Typography>
        <Typography color="textSecondary">{s}</Typography>
      </CardContent>
    </Card>
  );
};

const useStyles = makeStyles({
  depositContext: {
    flex: 1
  }
});

type Props = {
  ferments: Ferment[];
};
const Ferments = ({ ferments }: Props) => {
  const classes = useStyles();
  return (
    <>
      <Title>Current Ferments</Title>
      {ferments.map(f => (
        <FermentItem ferment={f} />
      ))}
    </>
  );
};

export default Ferments;
