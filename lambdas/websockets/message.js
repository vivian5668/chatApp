const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
  console.log(event)

  const { connectionId: connectionID} = event.requestContext;

  const body = JSON.parse(event.body);

  try {
    const record = await Dynamo.get(connectionID, tableName);
    const {messages, domainName, stage} = record;

    messages.push(body.message);
    const data = {
      ...record,
      messages
    }

    await Dynamo.write(data, tableName);

    await WebSocket.sned({
      domainName,
      stage,
      connectionID,
      message: "This is a reply"
    })


    return Responses._200({message: 'got a message'})
  } catch (error) {
    return Responses._400({message: 'message could not be recived'})
  }
}