// Messaging
const HOST = '127.0.0.1';
const PULLER_PORT = 3010;
const WEB_SERVER_PORT = 3001;
var Puller = require('./messaging/puller');
var puller = new Puller().initInstance(HOST, PULLER_PORT);

// start the messaging services
puller.start();

// start the API/web server
require('./web/webserver')(WEB_SERVER_PORT);
