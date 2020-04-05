const AWS = require('aws-sdk');

const create = (domainName, stage) => {
  const endpoint = `${domainName}/${stage}`;
  return new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint,
  })
}

const send = ({domainName, stage, connectionID, message}) => {
  console.log(`in websocketMessage: before ws is created`)
  const ws = create(domainName, stage);
  console.log(`in websocketMessage:  ws is created`)
  const postParams = {
    ConnectionId: connectionID,
    Data: message,
  }
  console.log(`in websocketMessage:  postParams is ${JSON.stringify(postParams)}`)
  return ws.postToConnection(postParams, function(err, data) {
    console.log(`in websocketMessage: in postToConnection callBack`)
    if (err) console.log(`${err}`); // an error occurred
    else     console.log(`data is ${data}`);           // successful response
  }).promise();
}

module.exports = {
  send
}