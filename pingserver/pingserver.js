// Messaging
var Publisher = require('./publisher');
var publisher = new Publisher('127.0.0.1', 3010);
var PingService = require('./ping.service');
var pingService = new PingService(publisher);
var Responder = require('./responder');
var responder = new Responder('127.0.0.1', 3020, pingService);

// API/Web
const express = require('express');
const http = require('http');
const path = require('path');
const logger = require('morgan');
const apiRouter = require('./api.router');

// start the messaging services
publisher.start();
responder.start();

// initialize the API/Web server
const app = express();
const PORT = 3000;

// This is for proxies
app.set('trust proxy', 'loopback');

// this will find the built angular application
const relativePathToStaticFiles = '../pingweb/dist/web';
app.use(express.static(path.join(__dirname, relativePathToStaticFiles)));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

app.use('/poop', (req, res, next) => {
  res.json({
    poop: 'pee'
  })
});

// this will handle API routes
app.use('/api', apiRouter(pingService)());

// If we get here we will assume that the request is for the angular app
app.use('/', (req, res, next) => { 
    res.sendFile(path.join(__dirname, `${relativePathToStaticFiles}/index.html`));
});

// error handler
app.use((err, req, res, next) => {
    var status = 500;
    var message = "Server Error";
    if (!!err) {
      status = err.status || status;
      message = err.message || message;
    }
    var error = {
      status: status,
      message: message
    };
    res.status(status).json(error);
});
  
// create the server
var port = process.env.PORT || '3000';
app.set('port', port);
var server = http.createServer(app);

// start the server
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  var message = `Listening on ${bind}`;
  console.info(message)
}
  


/*
setInterval(function(){
  console.log('publisher: sending');
  publisher.send('publisher: sending');
}, 2000);
*/


/*

PING STATE MACHINE

START_GAME (initial state)
Lifecycle: OnEnter
* init the list of actions
* pushes a notification to the PONG server that we are starting a new game. 
    - the payload of the message is an array of the next states that are possible: START_GAME, PING
* sends a message to the web socket giving the action and the current state and the next allowed states

Transitions:
* gotoPing()
* gotoQuit()

PING_STATE
Lifecycle: OnEnter
* pushes a notification to the PONG server that we've entered the PING state
    - the payload of the message is an array of next states that are possible: START_GAME, PONG
* sends a message to the web socket giving the actionand the current state and the next allowed states

Transitions:
* gotoPong()
* gotoStartGame()


PONG_STATE
Lifecycle: OnEnter
* pushes a notification to the PING server that we've entered the PONG state
    - the payload of the message is an array of the next states that are possible: START_GAME, PING
* sends a message to the web socket giving the actionand the current state and the next allowed states


Transitions:
* gotoPing()
* gotoStartGame()


PING API
* POST: /api/game - This will start a new game
    - This will attempt to transition the state machine to the START_GAME state
* POST: /api/game/ping - This will send a ping request
* GET: /game/actions - this will get a list of all of the actions taken so far
* GET: /game/actions/current - this will get the current action
* GET: /game/actions/next = this will get the next action that we are waiting for


PONG SERVER:
Pulls messages from the Ping Server to do the following:
* ACTION_TAKEN - When this is received, it will know that a new game is started 
    and will set the next state in its memory, and broadcast a message to the web socket
    saying the current state and the next states that are allowed

Pong Server also has a ZMQ req/rep q where it will can sned the following messages:
* START_GAME_REQUEST - So that the Pong server can request that a new game be started
* PONG_REQUEST - So that it can send a request to do a pong
* READY_REQUEST - This will tell the PING server that the Pong server has just connected
    - it will send back the current action and the next action allowed
    - a list of actions already taken


PONG API:
* POST: /api/game - This will start a new game
    - This will attempt to transition the state machine to the START_GAME state
* POST: /api/game/pong - This will send a pong request
* GET: /game/actions - this will get a list of all of the actions taken so far
* GET: /game/actions/current - this will get the current action
* GET: /game/actions/next = this will get the next action that we are waiting for

Fault Tolerance:
If the PING server goes down and comes back up, it will start a new game

If the PONG server goes down and comes back up, it will send out a READY_REQUEST and pick up 
where it left off

*/



