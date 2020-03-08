const fs = require("fs");
const AWS = require("aws-sdk");
const moment = require("moment");
const Gpio = require("onoff").Gpio;
const nodeCleanup = require("node-cleanup");

const DynamoDB = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2" });
const file = "/sys/bus/w1/devices/28-0316a279370d/w1_slave"; // TODO glob

const relay1Pin = 26; // 37
const relay2Pin = 20; // 38
const relay3Pin = 21; // 40
const relay1 = new Gpio(relay1Pin, "out");
const relay2 = new Gpio(relay2Pin, "out");
const relay3 = new Gpio(relay3Pin, "out");

nodeCleanup((exitCode, signal) => {
  relay1.unexport();
  relay2.unexport();
  relay3.unexport();
});

const getTemp = () => {
  const contents = fs.readFileSync(file, "utf8");
  const tidx = contents.indexOf("t=");
  const traw = contents.substring(tidx + 2);
  const t = (traw / 1000).toFixed(3);

  return t;
};

const sendStateToDynamo = state => {
  const ttl = moment()
    .add(24, "hours")
    .unix(); // not 1 day cuz daylight savings
  const params = {
    TableName: "readings",
    Item: {
      time: new Date().toISOString(),
      ttl,
      ...state
    }
  };
  DynamoDB.put(params, function(err) {
    if (err) {
      console.log(err);
      // Kill switch if I'm unable to monitor it
      process.exit();
    }
  });
};

const getHeaterOn = temp => {
  // TODO bang-bang
  return temp < 19;
};

const turnHeaterOnOff = isOn => {
  relay3.writeSync(isOn ? 1 : 0);
};

const loop = () => {
  const temp = getTemp();
  const heaterOn = getHeaterOn(temp);

  turnHeaterOnOff(heaterOn);

  sendStateToDynamo({
    temp,
    heaterOn
  });

  // TODO check t > 40 because something's probably on fire
};

const periodMs = 1000 * 60;
const run = async () => {
  setInterval(() => {
    loop();
  }, periodMs);
  loop(); // Run first loop immediately
};

run();
