import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";
import { format } from "date-fns";
import React, { useEffect, useState, useCallback } from "react";
import {
  createAuthOptions,
  getAccessToken,
  isAuthenticated,
  login,
  logout
} from "./auth/util";
import Chart from "./Chart";
import Ferments from "./Ferments";
import ReadingsTable from "./ReadingsTable";
import Stat from "./Stat";
import { Ferment, Reading } from "./types";
import useStyles from "./useStyles";
import useInterval from "./useInterval";

const Dashboard = () => {
  const auth = createAuthOptions();
  useEffect(() => {
    if (!isAuthenticated()) {
      login(auth);
    }
  }, [auth]);

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [readings, setReadings] = useState<Reading[]>([]);
  const [ferments, setFerments] = useState<Ferment[]>([]);

  const lastReading =
    readings.length > 0 ? readings[readings.length - 1] : null;

  console.log({ lastReading });

  const getData = useCallback(() => {
    fetch("/.netlify/functions/readings", {
      headers: new Headers({
        Authorization: `Bearer ${getAccessToken()}`
      })
    })
      .then(r => r.json())
      .then(d => {
        const sorted = [...d].sort((a, b) => a.time.localeCompare(b.time));
        setReadings(sorted);
      })
      .catch(err => console.log(err));

    fetch("/.netlify/functions/ferments", {
      headers: new Headers({
        Authorization: `Bearer ${getAccessToken()}`
      })
    })
      .then(r => r.json())
      .then(setFerments)
      .catch(err => console.log(err));
  }, []);

  useEffect(() => getData(), [getData]);
  useInterval(() => getData(), 10000); // Refresh dashboard every 10 seconds

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

          <Button variant="contained" onClick={() => logout()}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                <Chart readings={readings} />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <Ferments ferments={ferments} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <Stat
                  name="Last Read Time"
                  value={
                    lastReading &&
                    format(new Date(lastReading.time), "HH:mm:ss")
                  }
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <Stat
                  name="Last Read Temp °/C"
                  value={lastReading && `${lastReading.temp.toFixed(2)}`}
                />
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <Stat
                  name="Heater Status"
                  value={
                    !lastReading ? null : lastReading.heaterOn ? "On" : "Off"
                  }
                />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <ReadingsTable readings={readings} />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </main>
    </div>
  );
};

export default Dashboard;
