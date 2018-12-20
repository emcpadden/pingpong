var zmq = require('zeromq');

class Publisher {
    constructor(host, port) {
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

module.exports = Publisher;
