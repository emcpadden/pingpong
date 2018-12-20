// Messaging
const HOST = '127.0.0.1';
const PUBLISHER_PORT = 3010;
const RESPONDER_PORT = 3020;
const WEB_SERVER_PORT = 3000;
var Publisher = require('./messaging/publisher');
var publisher = new Publisher().initInstance(HOST, PUBLISHER_PORT);
var Responder = require('./messaging/responder');
var responder = new Responder().initInstance(HOST, RESPONDER_PORT);

// start the messaging services
publisher.start();
responder.start();

// start the API/web server
require('./web/webserver')(WEB_SERVER_PORT);

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



