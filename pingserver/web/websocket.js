class Websocket {

    constructor() {
        this.io = null;
    }

    init(server) {
        this.io = require('socket.io')(server);
        this.io.on('connection', this.onConnect.bind(this));
    }

    onConnect(socket) {
        console.log('a user connected to the web socket');
        socket.on('disconnect', this.onDisconnect.bind(this));
        socket.emit('connection', {type: 'connection', success: true, message: 'the connection has succeeded'});
    }

    onDisconnect() {
        console.log('user disconnected from web socket');
    }

    onMessage(message) {
        let json = JSON.stringify(message);
        console.log(`Message From User: ${json}`);
    }

    sendMessage(message) {
        if (!!this.io) {
            this.io.emit('message', message);
        }
    }
}

class WebsocketSingleton {

    constructor() {
        if (!WebsocketSingleton.instance) {
            WebsocketSingleton.instance = new Websocket();
        }
    }

    initInstance(server) {
        let instance = this.getInstance();
        instance.init(server);
        return instance;
    }
  
    getInstance() {
        return WebsocketSingleton.instance;
    }
}

module.exports = WebsocketSingleton;
