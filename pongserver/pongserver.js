// worker.js
var zmq = require('zeromq')
  , puller = zmq.socket('pull')
  , requester = zmq.socket('req');

puller.on('message', function(msg){
    console.log('puller: get: %s', msg.toString());
});

puller.connect('tcp://127.0.0.1:3010');
console.log('puller connected to port 3010');

requester.connect("tcp://localhost:3020");
console.log('requester connected to port 3010');

/*
console.log('Sending request');
requester.send('requester: send message');
*/