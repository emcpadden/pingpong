const express = require("express");
const router = express.Router();
const GameService = require('../services/game');
const gameService = new GameService().getInstance();
const Websocket = require('../web/websocket');
const websocket = new Websocket().getInstance();

/**
 * This function comment is parsed by doctrine
 * @route GET /api/game
 * @group api - Pong API operations
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
 * @group api - Pong API operations
 * @returns {object} 200 - send START command to start a new game
 * @returns {Error}  default - Unexpected error
 */
router.post("/game", (req, res, next) => {
    // used to start a new game
    let promise = gameService.start();
    promise.then(
        (result) => {
            res.json(result);

            // send the commandResponse back to the web browser
            websocket.sendCommand(result);
        }
    );
});

/**
 * This function comment is parsed by doctrine
 * @route POST /api/game/pong
 * @group api - Pong API operations
 * @returns {object} 200 - send PING command
 * @returns {Error}  default - Unexpected error
 */
router.post("/game/pong", (req, res, next) => {
    // used to attempt to send a PING action
    let promise = gameService.pong();
    promise.then(
        (result) => { 
            res.json(result);

            // send the commandResponse back to the web browser
            websocket.sendCommand(result);
        }
    );
});

module.exports = router;
