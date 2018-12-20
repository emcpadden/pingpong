const express = require("express");
const router = express.Router();

function createApiRouter(pingServiceInstance) {
    
    var pingService = pingServiceInstance;

    return function() {

        router.get("/game", function(req, res, next) {
            // returns information about the current state of the game
            let gameInfo = pingService.getGameInfo();
            res.json(gameInfo);
        });

        router.post("/game", (req, res, next) => {
            // used to start a new game
            let result = pingService.startGame();
            res.json(result);
        });

        router.post("/game/ping", (req, res, next) => {
            // used to attempt to send a PING action
            let result = pingService.ping();
            res.json(result);
        });

		return router;
	};
}

module.exports = createApiRouter;
