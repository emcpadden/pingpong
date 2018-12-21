var zmq = require('zeromq');
const GameService = require('../services/game.service');
const gameService = new GameService().getInstance();

class Responder {
    constructor(host, port) {
    }

    init(host, port) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('rep');

        this.socket.on('message', (payload) => {
            let request = JSON.parse(payload);
            let response = gameService.onRequest(request);
            let json = JSON.stringify(response);
            this.socket.send(json);
        });
    }

    start() {
        this.socket.bindSync(this.addr);
        console.log(`responder bound to ${this.addr}`);
    }

    stop() {
        this.socket.close();
    }
}

class ResponderSingleton {

    constructor() {
        if (!ResponderSingleton.instance) {
            ResponderSingleton.instance = new Responder();
        }
    }

    initInstance(host, port) {
        let instance = this.getInstance();
        instance.init(host, port);
        return instance;
    }
  
    getInstance() {
        return ResponderSingleton.instance;
    }
}

module.exports = ResponderSingleton;
