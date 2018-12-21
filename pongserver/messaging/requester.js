var zmq = require('zeromq');
const uuid = require('uuid');

class Requestor {
    constructor() {
    }

    init(host, port, responseCallback) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('req');
        this.callback = responseCallback;

        this.socket.on('message', (payload) => {
            let message = JSON.parse(payload);
            if (!!this.callback) {
                this.callback(message);
            }
        });
    }

    start() {
        this.socket.connect(this.addr);
        console.log(`requester connected to ${this.addr}`);
    }

    stop() {
        this.socket.close();
    }

    send(command) {
        const requestId = uuid();
        this.socket.send(JSON.stringify({requestId, command}));
        return requestId;
    }
}

class RequestorSingleton {

    constructor() {
        if (!RequestorSingleton.instance) {
            RequestorSingleton.instance = new Requestor();
        }
    }

    initInstance(host, port, responseCallback) {
        let instance = this.getInstance();
        instance.init(host, port, responseCallback);
        return instance;
    }
  
    getInstance() {
        return RequestorSingleton.instance;
    }
}

module.exports = RequestorSingleton;
