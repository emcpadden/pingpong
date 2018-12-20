
class GameService {
    
    constructor(publisher) {
        this.publisher = publisher;
        this.actions = [];
    }

    getGameInfo() {
        this.publisher.send('PingService: GET_GAME_INFO');
        return {
            action: 'getGameInfo',
            actions: this.actions
        }
    }

    startGame() {
        this.publisher.send('PingService: START_GAME');
        return {
            action: 'startGame',
            sucess: true
        }
    }

    ping() {
        this.publisher.send('PingService: PING');
        return {
            action: 'ping',
            sucess: true
        }
    }

    pong() {
        this.publisher.send('PingService: PONG');
        return {
            action: 'pong',
            sucess: true
        }
    }
}

module.exports = GameService;
