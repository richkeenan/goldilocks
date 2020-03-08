import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import Chart from "./Chart";
import Ferments from "./Ferments";
import ReadingsTable from "./ReadingsTable";
import { Ferment, Reading } from "./types";
import useStyles from "./useStyles";

type Props = {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
};
const Dashboard = ({ isAuthenticated, onLogin, onLogout }: Props) => {
  useEffect(() => {
    if (!isAuthenticated) {
      onLogin();
    }
  }, [isAuthenticated, onLogin]);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [readings, setReadings] = useState<Reading[]>([]);
  const [ferments, setFerments] = useState<Ferment[]>([]);

  useEffect(() => {
    fetch("/.netlify/functions/get-temp", {
      headers: new Headers({
        Authorization: "derp"
      })
    })
      .then(r => r.json())
      .then(setReadings)
      .catch(err => console.log(err));

    fetch("/.netlify/functions/ferments", {
      headers: new Headers({
        Authorization: "derp"
      })
    })
      .then(r => r.json())
      .then(setFerments)
      .catch(err => console.log(err));
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Goldilocks
          </Typography>

          <Button variant="contained" onClick={onLogout}>
            Logout
          </Button>

          {/* <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            {/* Chart */}
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart data={readings} />
              </Paper>
            </Grid>
            {/* Recent Deposits */}
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Ferments ferments={ferments} />
              </Paper>
            </Grid>
            {/* Recent Orders */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ReadingsTable data={readings} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
