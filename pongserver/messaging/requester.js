var zmq = require('zeromq');

class Requestor {
    constructor(host, port) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('rep');

        this.socket.on('message', function(msg){
            console.log('requestor: req: %s', msg.toString());  
            responder.send(`requestor received: ${msg}`);
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

module.exports = Responder;
