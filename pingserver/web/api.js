const express = require("express");
const router = express.Router();
const GameService = require('../services/game.service');
const gameService = new GameService().getInstance();

/**
 * This function comment is parsed by doctrine
 * @route GET /api/game
 * @group api - Ping API operations
 * @returns {object} 200 - An array of actions
 * @returns {Error}  default - Unexpected error
 */
router.get("/game", function(req, res, next) {
    // returns information about the current state of the game
    let gameInfo = gameService.getGameInfo();
    res.json(gameInfo);
});

/**
 * This function comment is parsed by doctrine
 * @route POST /api/game
 * @group api - Ping API operations
 * @returns {object} 200 - send START command to start a new game
 * @returns {Error}  default - Unexpected error
 */
router.post("/game", (req, res, next) => {
    // used to start a new game
    let result = gameService.start();
    res.json(result);
});

/**
 * This function comment is parsed by doctrine
 * @route POST /api/game/ping
 * @group api - Ping API operations
 * @returns {object} 200 - send PING command
 * @returns {Error}  default - Unexpected error
 */
router.post("/game/ping", (req, res, next) => {
    // used to attempt to send a PING action
    let result = gameService.ping();
    res.json(result);
});

module.exports = router;
