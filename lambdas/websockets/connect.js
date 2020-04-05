const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

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

  return Responses._200({message: 'connected'});
}