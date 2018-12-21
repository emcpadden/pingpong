const HOST = '127.0.0.1';
const REQUESTER_PORT = 3020;
const Requester = require('../messaging/requester');
const Websocket = require('../web/websocket');
const websocket = new Websocket().getInstance();

class GameService {

    constructor() {
        this.actions = [];
        this.requestPromises = [];
        this.requester = new Requester().initInstance(HOST, REQUESTER_PORT, this.onResponse.bind(this));
        this.requester.start();
    }

    getGameInfo() {
        return {
            actions: [...this.actions]
        }
    }

    start() {
        const requestId = this.requester.send('START');
        return this.createPromise(requestId);
    }

    pong() {
        const requestId = this.requester.send('PONG');
        return this.createPromise(requestId);
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

        // send the response back to the web browser
        websocket.sendMessage(message);
    }

    onResponse(response) {
        let index = this.requestPromises.findIndex(r => r.requestId == response.requestId);
        if (index >= 0) {
            var promise = this.requestPromises.splice(index,1);
            delete response.requestId;
            promise[0].resolve(response);

            // send the response back to the web browser
            websocket.sendMessage(response);
        }
    }

    createPromise(requestId) {
        var res, rej;

        var promise = new Promise((resolve, reject) => {
            res = resolve;
            rej = reject;
        });
        promise.requestId = requestId;
        promise.resolve = res;
        promise.reject = rej;

        this.requestPromises.push(promise);

        return promise;
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
