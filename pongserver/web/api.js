const express = require("express");
const router = express.Router();
const GameService = require('../services/game');
const gameService = new GameService().getInstance();

router.get("/game", function(req, res, next) {
    // returns information about the current state of the game
    let gameInfo = gameService.getGameInfo();
    res.json(gameInfo);
});

router.post("/game", (req, res, next) => {
    // used to start a new game
    let result = gameService.startGame();
    res.json(result);
});

router.post("/game/pong", (req, res, next) => {
    // used to attempt to send a PING action
    let result = gameService.pong();
    res.json(result);
});

module.exports = router;
