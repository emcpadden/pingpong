const GameStateMachine = require('./game.statemachine');

class GameService {
    
    constructor() {
        this.actions = [];
        this.gameStateMachine = GameStateMachine();
        this.gameStateMachine.start();
    }

    getGameInfo() {
        return {
            state: this.gameStateMachine.state,
            actions: [...this.gameStateMachine.actions]
        }
    }

    start() {
        if (this.gameStateMachine.can('start')) {
            this.gameStateMachine.start();
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            let lastAction = this.gameStateMachine.lastAction();
            return {
                succeeded: true,
                command: 'START',
                action: lastAction,
                next
            }
        } else {
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            return {
                succeeded: false,
                command: 'START',
                next,
                error: `Cannot restart at this time`
            }
        }
    }

    ping() {
        if (this.gameStateMachine.can('ping')) {
            this.gameStateMachine.ping();
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            let lastAction = this.gameStateMachine.lastAction();
            return {
                succeeded: true,
                command: 'PING',
                action: lastAction,
                next
            }
        } else {
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            return {
                succeeded: false,
                command: 'PING',
                next,
                error: `Cannot ping at this time`
            }
        }
    }

    pong() {
        if (this.gameStateMachine.can('pong')) {
            this.gameStateMachine.pong();
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            let lastAction = this.gameStateMachine.lastAction();
            return {
                succeeded: true,
                command: 'PONG',
                action: lastAction,
                next
            }
        } else {
            let next = this.gameStateMachine.allowedCommands(this.gameStateMachine);
            return {
                succeeded: false,
                command: 'PONG',
                next,
                error: `Cannot pong at this time`
            }
        }
    }

    onRequest(request) {
        switch(request.command) {
            case "START":
                return Object.assign(this.start(), {requestId: request.requestId});
            case "PING":
                return Object.assign(this.ping(), {requestId: request.requestId});
            case "PONG":
                return Object.assign(this.pong(), {requestId: request.requestId});
            default:
                return {
                    succeeded: false,
                    requestId: request.requestId,
                    command: request.command,
                    next: this.gameStateMachine.allowedCommands(),
                    error: `Unknown Command: ${command}`
                }
        }
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
