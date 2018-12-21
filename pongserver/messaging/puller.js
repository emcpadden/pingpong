var zmq = require('zeromq');
const GameService = require('../services/game');
const gameService = new GameService().getInstance();

class Puller {
    constructor() {

    }

    init(host, port) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('pull');
        this.socket.on('message', this.onMessage)
    }

    start() {
        this.socket.connect(this.addr);
        console.log(`puller connected to ${this.addr}`);
    }

    stop() {
        this.socket.disconnect();
    }

    onMessage(payload) {
        let message = JSON.parse(payload);
        gameService.onMessage(message);
    }
}

class PullerSingleton {

    constructor() {
        if (!PullerSingleton.instance) {
            PullerSingleton.instance = new Puller();
        }
    }

    initInstance(host, port) {
        let instance = this.getInstance();
        instance.init(host, port);
        return instance;
    }
  
    getInstance() {
        return PullerSingleton.instance;
    }
  
}

module.exports = PullerSingleton;
