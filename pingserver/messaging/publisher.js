var zmq = require('zeromq');

class Publisher {
    constructor() {
    }

    init(host, port) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('push');
    }

    start() {
        this.socket.bindSync(this.addr);
        console.log(`publisher bound to ${this.addr}`);
    }

    stop() {
        this.socket.close();
    }

    send(msg) {
        this.socket.send(msg);
    }
}

class PublisherSingleton {

    constructor() {
        if (!PublisherSingleton.instance) {
            PublisherSingleton.instance = new Publisher();
        }
    }

    initInstance(host, port) {
        let instance = this.getInstance();
        instance.init(host, port);
        return instance;
    }
  
    getInstance() {
        return PublisherSingleton.instance;
    }
  
}

module.exports = PublisherSingleton;
