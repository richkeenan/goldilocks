const fs = require("fs");
const AWS = require("aws-sdk");
const moment = require("moment");
const Gpio = require("onoff").Gpio;
const nodeCleanup = require("node-cleanup");

const DynamoDB = new AWS.DynamoDB.DocumentClient({ region: "eu-west-2" });
const file = "/sys/bus/w1/devices/28-0316a279370d/w1_slave";

console.log("Starting");

const relay1Pin = 26; // 37
const relay2Pin = 20; // 38
const relay3Pin = 21; // 40
const relay1 = new Gpio(relay1Pin, "out");
const relay2 = new Gpio(relay2Pin, "out");
const relay3 = new Gpio(relay3Pin, "out");

nodeCleanup((exitCode, signal) => {
  console.log("running cleanup");
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

const sendToDynamo = t => {
  const ttl = moment()
    .add(24, "hours")
    .unix(); // not 1 day cuz daylight savings
  const params = {
    TableName: "temp",
    Item: {
      time: new Date().toISOString(),
      temp: t,
      ttl
    }
  };
  console.log(params);
  DynamoDB.put(params, function(err) {
    if (err) {
      console.log(err);
      process.exit();
    }
  });
};

const run = async () => {
  setInterval(() => {
    const t = getTemp();
    console.log(t);

    if (t > 21) {
      relay1.writeSync(1);
    } else {
      relay1.writeSync(0);
    }
    sendToDynamo(t);
  }, 1000);
};

run();
