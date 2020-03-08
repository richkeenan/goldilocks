import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import Title from "./Title";

const useStyles = makeStyles({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

type Props = {
  name: string;
  value: string | number | null;
};
const Stat = ({ name, value }: Props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Title>{name}</Title>
      {value && (
        <Typography component="p" variant="h4">
          {value}
        </Typography>
      )}
    </div>
  );
};

export default Stat;
