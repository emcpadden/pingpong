const Publisher = require('../messaging/publisher');
const publisher = new Publisher().getInstance();
var StateMachine = require('javascript-state-machine');

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

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // we will push a notification to tell the pong server that 
                // a new game has started
                let msg = {
                    action: {
                        type: "START",
                        timestamp: new Date()
                    },
                    next
                };
                publisher.send(JSON.stringify(msg));  
            },
            onPing: (event) => {

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // create a new action and add it to the list
                let action = {
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
            },
            onPong: (event) => {

                // get the nect transitions
                let next = event.fsm.allowedCommands(event.fsm);

                // create a new action and add it to the list
                let action = {
                    type: "PONG",
                    timestamp: new Date()
                }
                this.actions.push(action);
                
                // create the message to publish
                let msg = {
                    action: {
                        type: "PONG",
                        timestamp: new Date()
                    },
                    next
                };
                
                // we will push a notification to tell the pong server that 
                // a new game has started
                publisher.send(JSON.stringify(msg));
            },
            allowedCommands: (fsm) => {
                return fsm.transitions().map(t => t.toUpperCase());
            }
        }
    });
}

module.exports = createGameStateMachine;