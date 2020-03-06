const AWS = require("aws-sdk");

const DynamoDB = new AWS.DynamoDB.DocumentClient({
  region: "eu-west-2"
});

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
