const Responses = require('../common/API_Responses');
const Dynamo = require('../common/Dynamo');
const WebSocket = require('../common/websocketMessage');

const tableName = process.env.tableName;

exports.handler = async event => {
  console.log(event)

  const { connectionId: connectionID } = event.requestContext;

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

    await WebSocket.send({
      domainName,
      stage,
      connectionID,
      message: "This is a reply"
    })

      // get all current connected clients and broadcast data
  console.log("before getting all messages")
  const {allMessages, connectionsIDs} = await Dynamo.getAllMessagesAndConnections(tableName);
  console.log(`allMessages are: ${allMessages}, connectionsIDs are: ${connectionsIDs}`)

  console.log(`after websocket sends`)
  connectionsIDs.map(c => await WebSocket.send({ domainName, stage, connectionID: c.connectionID, message: allMessages }))
  // const promises = connectionsIDs.map(c => await WebSocket.send({ domainName, stage, connectionID: c.connectionID, message: allMessages }).promise());
  // await Promise.all(promises);


    return Responses._200({message: 'got a message'})
  } catch (error) {
    return Responses._400({message: 'message could not be recived'})
  }
}