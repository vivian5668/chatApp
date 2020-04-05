const AWS = require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();

const Dynamo = {
    async get(ID, TableName) {
        const params = {
            TableName,
            Key: {
                ID,
            },
        };

        const data = await documentClient.get(params).promise();

        if (!data || !data.Item) {
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }
        console.log(data);

        return data.Item;
    },

    async write(data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }

        return data;
    },

    async delete(ID, TableName) {
      const params = {
        TableName,
        Key: {
          ID
        }
      }

      return documentClient.delete(params).promise();
    },

    async getAllMessagesAndConnections(table) {
        let allMessages = []
        let connectionsIDs = []
        const params = {
            TableName: table
        }
        console.log(`in getAllMessagesAndConnections.....`)

        const data = await documentClient.get(params).promise();

        if (!data || !data.Items) {
            throw Error(`There was an error fetching the data for ID of ${ID} from ${TableName}`);
        }
        console.log(data);
        data.Items.forEach(function(record) {
            allMessages = [...allMessages, record.messages]
            connectionsIDs = [...connectionsIDs, record.connectionsID]
        });


        // await documentClient.scan(params, function(err, data) {
        //     console.log(`err is ${err}`)
        //     data.Items.forEach(function(record) {
        //         allMessages = [...allMessages, record.messages]
        //         connectionsIDs = [...connectionsIDs, record.connectionsID]
        //     });
        // }).promise();
        conosle.log(`all messages are: ${JSON.stringify(allMessages)}`)
        conosle.log(`all connectionsIDs are: ${JSON.stringify(connectionsIDs)}`)
        return {
            allMessages,
            connectionsIDs
        };
    }
};
module.exports = Dynamo;