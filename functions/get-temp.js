const AWS = require("aws-sdk");

var config = new AWS.Config({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2"
});

AWS.config = config;

const DynamoDB = new AWS.DynamoDB.DocumentClient({});

exports.handler = async (event, context, callback) => {
  const data = await DynamoDB.scan({
    TableName: "temp"
  }).promise();

  const itemsByTime = data.Items.sort((a, b) => a.time.localeCompare(b.time));
  const body = itemsByTime.map(i => ({ time: i.time, temp: i.temp }));

  callback(null, {
    statusCode: 200,
    body
  });
};
