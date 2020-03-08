const AWS = require("aws-sdk");

var config = new AWS.Config({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2"
});

AWS.config = config;

const DynamoDB = new AWS.DynamoDB.DocumentClient({});

exports.handler = (event, context, callback) => {
  DynamoDB.scan({
    TableName: "ferments"
  })
    .promise()
    .then(data => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(data.Items)
      });
    });
};
