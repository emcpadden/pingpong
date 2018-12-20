
class GameService {
    
    constructor(requestor) {
        this.requestor = requestor;
        this.actions = [];
    }

    getGameInfo() {
        this.requestor.send('PongService: GET_GAME_INFO');
        return {
            action: 'getGameInfo',
            actions: this.actions
        }
    }

    startGame() {
        this.requestor.send('PongService: START_GAME');
        return {
            action: 'startGame',
            sucess: true
        }
    }

    pong() {
        this.publisher.send('PongService: PONG');
        return {
            action: 'pong',
            sucess: true
        }
    }
}

module.exports = GameService;
