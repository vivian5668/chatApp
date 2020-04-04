const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');

const tableName = process.env.tableName;

exports.handler = async event => {
  console.log(event);

  const { connectionId: connectionID, domainName, stage} = event.requestContext;

  const data = {
    ID: connectionID,
    date: Date.now(),
    messages: [],
    domainName,
    stage
  }

  await Dynamo.write(data, tableName)

  // get all current connected clients and broadcast data
  // const connections = await getAllConnections();
  // const promises = connections.map(c => apiGwMgmtApi.postToConnection({ ConnectionId: c.connectionId, Data: 'test' }).promise());
  // await Promise.all(promises);

  return Responses._200({message: 'connected'});
}