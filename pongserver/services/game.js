const HOST = '127.0.0.1';
const REQUESTER_PORT = 3020;
var Requester = require('../messaging/requester');

class GameService {

    constructor() {
        this.actions = [];
        this.requester = new Requester().initInstance(HOST, REQUESTER_PORT, this.onResponse);
        this.requester.start();
    }

    getGameInfo() {
        return {
            actions: [...this.actions]
        }
    }

    startGame() {
        this.requester.send('START');
        return {
            command: 'START',
            status: 'SENT'
        }
    }

    pong() {
        this.requester.send('PONG');
        return {
            command: 'PONG',
            status: 'SENT'
        }
    }

    onMessage(message) {
        switch(message.action.type) {
            case "START":
                this.actions = [];
            case "PING":
            case "PONG":
                this.actions.push(message.action);
                break;
            default:
                break;
        }
    }

    onResponse(response) {
        let json = JSON.stringify(response);
        console.log(json);
    }
}

class GameServiceSingleton {

    constructor() {
        if (!GameServiceSingleton.instance) {
            GameServiceSingleton.instance = new GameService();
        }
    }

    getInstance() {
        return GameServiceSingleton.instance;
    }
  
}

module.exports = GameServiceSingleton;
