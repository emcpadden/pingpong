const Publisher = require('../messaging/publisher');
const publisher = new Publisher().getInstance();
const GameStateMachine = require('./game.statemachine');

class GameService {
    
    constructor() {
        this.actions = [];
        this.gameStateMachine = GameStateMachine();
    }

    getGameInfo() {
        return {
            state: this.gameStateMachine.state,
            actions: [...this.gameStateMachine.actions]
        }
    }

    startGame() {
        if (this.gameStateMachine.can('start')) {
            this.gameStateMachine.start();
            return {
                succeeded: true,
                state: this.gameStateMachine.state
            }
        } else {
            return {
                succeeded: false,
                state: this.gameStateMachine.state,
                error: `Cannot restart at this time`
            }
        }
    }

    ping() {
        if (this.gameStateMachine.can('ping')) {
            this.gameStateMachine.ping();
            return {
                succeeded: true,
                state: this.gameStateMachine.state
            }
        } else {
            return {
                succeeded: false,
                state: this.gameStateMachine.state,
                error: `Cannot ping at this time`
            }
        }
    }

    pong() {
        if (this.gameStateMachine.can('pong')) {
            this.gameStateMachine.pong();
            return {
                succeeded: true,
                state: this.gameStateMachine.state
            }
        } else {
            return {
                succeeded: false,
                state: this.gameStateMachine.state,
                error: `Cannot pong at this time`
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
