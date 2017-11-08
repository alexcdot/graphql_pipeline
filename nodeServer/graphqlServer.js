var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var amqp = require('amqplib/callback_api');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// node sender
function sendMessage () {
  amqp.connect('amqp://rabbitmq', function(err, conn) {
    conn.createChannel(function(err, ch) {
      var q = 'hello';
      var msg = 'Hello World!';

      ch.assertQueue(q, {durable: false});
      // Note: on Node 6 Buffer.from(msg) should be used
      ch.sendToQueue(q, new Buffer(msg));
      console.log(" [x] Sent %s", msg);
    });
    setTimeout(function() { conn.close(); /*process.exit(0)*/ }, 500);
  });    
}

// node receiver
function receiveMessage () {
  let isSuccess = false;

  return new Promise((resolve, reject) => {
    setTimeout(function() {
      if (!isSuccess) {
        reject('Rabbitmq timeout error');
      }
    }, 5000);

    amqp.connect('amqp://rabbitmq', function(err, conn) {
      conn.createChannel(function(err, ch) {
        var q = 'goodbye';

        ch.assertQueue(q, {durable: false});
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, function(msg) {
          console.log(" [x] Received %s", msg.content.toString());
          resolve(msg.content.toString());
          isSuccess = true;
          conn.close();

        // return message in graphql

        }, {noAck: true});
      });
    });  
  });
}

function processGraphqlQuery() {
  sendMessage();
  return receiveMessage();
}

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    // call rabbit mq here
    return processGraphqlQuery();
  },
};

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Constants
const PORT = 4000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST);
console.log(`Running a GraphQL API server at ${HOST}:${PORT}/graphql`);