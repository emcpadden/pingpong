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
            onStart: () => {
                // When we start, we will initialize the action array to an empty array
                this.actions = [];

                // we will push a notification to tell the pong server that 
                // a new game has started
                let msg = {
                    action: {
                        type: "START",
                        timestamp: new Date()
                    },
                    next: ["PING", "START"]
                };
                publisher.send(JSON.stringify(msg));  
            },
            onPing: () => {

                // create a new action and add it to the list
                let action = {
                    type: "PING",
                    timestamp: new Date()
                }
                this.actions.push(action);

                // create the message to publish
                let msg = {
                    action,
                    next: ["PONG", "START"]
                };

                // we will push a notification to tell the pong server that 
                // a new game has started
                publisher.send(JSON.stringify(msg));
            },
            onPong: () => {

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
                    next: ["PING", "START"]
                };
                
                // we will push a notification to tell the pong server that 
                // a new game has started
                publisher.send(JSON.stringify(msg));
            }
        }
    });
}

module.exports = createGameStateMachine;