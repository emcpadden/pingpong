const Publisher = require('../messaging/publisher');
const publisher = new Publisher().getInstance();
const StateMachine = require('javascript-state-machine');
const uuid = require('uuid');
const Websocket = require('../web/websocket');
const websocket = new Websocket().getInstance();

function createGameStateMachine() {

    return new StateMachine({
        init: 'begin',
        transitions: [
            { 
              name: 'ping', 
              from: ['started', 'ponged'], 
              to: 'pinged' 
            },
            { 
                name: 'pong', 
                from: 'pinged', 
                to: 'ponged' 
            },
            {
                name: 'start',
                from: ['begin', 'started', 'pinged', 'ponged'],
                to: 'started'
            }
        ],
        data: {
            actions: []
        },
        methods: {
            onStart: (event) => {
                // When we start, we will initialize the action array to an empty array
                this.actions = [];

                // create a new action and add it to the list
                let action = {
                    id: uuid(),
                    type: "START",
                    timestamp: new Date()
                }
                this.actions.push(action);

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // we will push a notification to tell the pong server that 
                // a new game has started
                let msg = {
                    action,
                    next
                };
                publisher.send(JSON.stringify(msg));

                // send this to the browser
                websocket.sendMessage(msg);  
            },
            onPing: (event) => {

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // create a new action and add it to the list
                let action = {
                    id: uuid(),
                    type: "PING",
                    timestamp: new Date()
                }
                this.actions.push(action);

                // create the message to publish
                let msg = {
                    action,
                    next
                };

                // we will push a notification to tell the pong server that 
                // a new game has started
                publisher.send(JSON.stringify(msg));

                // send this to the browser
                websocket.sendMessage(msg);  
            },
            onPong: (event) => {

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // create a new action and add it to the list
                let action = {
                    id: uuid(),
                    type: "PONG",
                    timestamp: new Date()
                }
                this.actions.push(action);
                
                // create the message to publish
                let msg = {
                    action,
                    next
                };
                
                // we will push a notification to tell the pong server that 
                // a new game has started
                publisher.send(JSON.stringify(msg));

                // send this to the browser
                websocket.sendMessage(msg);  
            },
            allowedCommands: (fsm) => {
                return fsm.transitions().map(t => t.toUpperCase());
            },
            lastAction: () => {
                let lastAction = null;
                if (this.actions.length > 0) {
                    lastAction = this.actions[this.actions.length - 1];
                }
                return lastAction;
            }
        }
    });
}

module.exports = createGameStateMachine;