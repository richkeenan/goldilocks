const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
var jwksClient = require("jwks-rsa");

const allowedSubs = "google-oauth2|116361610266102586449";
const AUTH0_TENANT = process.env.AUTH0_TENANT;

var client = jwksClient({
  jwksUri: `${AUTH0_TENANT}.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

var config = new AWS.Config({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "eu-west-2"
});

AWS.config = config;

const DynamoDB = new AWS.DynamoDB.DocumentClient({});

exports.handler = (event, context, callback) => {
  let token;
  const authHeader = event.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7, authHeader.length);
  } else {
    callback(null, {
      statusCode: 401,
      body: "no token"
    });
    return;
  }

  jwt.verify(
    token,
    getKey,
    {
      issuer: AUTH0_TENANT
    },
    (err, decoded) => {
      if (err) {
        callback(null, {
          statusCode: 401,
          body: "invalid token"
        });
        return;
      }

      if (!allowedSubs.includes(decoded.sub)) {
        callback(null, {
          statusCode: 401,
          body: "invalid user"
        });
        return;
      }

      DynamoDB.scan({
        TableName: "readings"
      })
        .promise()
        .then(data => {
          const body = data.Items.map(i => ({
            time: i.time,
            temp: parseFloat(i.temp)
          }));
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(body)
          });
        });
    }
  );
};
