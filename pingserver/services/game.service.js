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
            return {
                succeeded: true,
                command: 'START',
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
            return {
                succeeded: true,
                command: 'PING',
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
            return {
                succeeded: true,
                command: 'PONG',
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

    onRequest(command) {
        switch(command) {
            case "START":
                return this.start();
            case "PING":
                return this.ping();
            case "PONG":
                return this.pong();
            default:
                return {
                    succeeded: false,
                    command: command,
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
