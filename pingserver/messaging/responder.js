var zmq = require('zeromq');

class Responder {
    constructor(host, port, gameService) {
        this.addr = `tcp://${host}:${port}`;
        this.socket = zmq.socket('rep');

        this.socket.on('message', function(msg){
            console.log('responder: req: %s', msg.toString());  
            responder.send(`responder received: ${msg}`);
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
