// http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
"use strict";

// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'jeopardy!';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Global variables
 */
// latest 100 messages
// var history = [ ];
// list of currently connected clients (users)
var clients = [ ];

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");

var playerStatus = {
    
};

lastScore: null;

let points;
let buzzOrder = [];
let firstBuzz;
let finalJeopardyCount = 0;

var gameBoardConnection = null;
var gameControllerConnection = null;
var gamePlayersConnection = [];

let msg = {
    type: null,
    value: null
};

/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
                      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}


function sendToBoard(message){
    clients[gameBoardConnection].sendUTF(json);
}

function sendToController(message){
    clients[gameControllerConnection].sendUTF(json);
}

function sendToPlayer(message, player){
    clients[player].sendUTF(json);
}

function sendToAllPlayers(message){
    for(var i = 0; i < gamePlayersConnection.length; i++){
        let p = gamePlayersConnection[i];
        clients[p].sendUTF(json);
    }

}

function sendToAllConnections(message){
    for(var i = 0; i < clients.length; i++){
        clients[i].sendUTF(json);
    }
}

function activateBuzzer(){
    buzzOrder = [];
    msg.type = 'activateBuzzer';
    msg.value = {};
    sendToAllPlayers(JSON.stringify(msg));
}

// Array with some colors
// var colors = [ 'red', 'green', 'blue', 'magenta', 'purple', 'plum', 'orange' ];
// ... in random order
// colors.sort(function(a,b) { return Math.random() > 0.5; } );

/**
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    var done = finalhandler(request, response);
    serve(request, response, done);
});
server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});

/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    // an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
    httpServer: server
});

// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
    var connection = request.accept(null, request.origin); 
    // we need to know client index to remove them on 'close' event
    var index = clients.push(connection) - 1;
    var userName = '';
    // var userColor = false;

    console.log((new Date()) + ' Connection accepted.');
    console.log(clients);

    // // send back chat history
    // if (history.length > 0) {
    //     connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    // }

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text

            let messageJSON = JSON.parse(message.utf8Data);
            let messageType = messageJSON.type;

            if(messageType === 'join'){
                let connectionType = messageJSON.value.connectionType;

                // determine type of connection
                // and assign index to correct variable
                if(connectionType === 'board'){
                    gameBoardConnection = index;
                }
                else if (connectionType === 'contoller'){
                    gameControllerConnection = index;
                }
                else if (connectionType === 'player'){
                     userName = messageJSON.value.name;
                     console.log(userName + ' has joined');
                     gamePlayersConnection.push(index);

                     msg.type= 'join';
                     msg.value = {name: userName};
                     sendToBoard(JSON.stringify(msg));

                     if(!playerStatus[userName]){
                        playerStatus[userName].score = 0;
                     }

                }
                else{
                    console.log("OOPS: unknown join :: " + messageJSON);
                }
            }
            else if (messageType === 'display-QA'){
                // send category info to devices
                let category = messageJSON.value.category;
                let points = messageJSON.value.points;

                console.log('QUESTION :: ' + category + ' - ' + points);

                msg.type = 'displayQA';
                msg.value = {
                    category: category,
                    points: points
                }

                // activate buzzers
                // wait 500ms
                setTimeout(activateBuzzer(),500);

            }
            else if (messageType === 'buzz'){
                buzzOrder.push(index);

                //disable buzz-in
                msg.type = 'disable-buzzer';
                msg.value = {};
                sendToAllPlayers(msg);

                firstBuzz = buzzOrder[0];
                msg.type = 'buzz-in';
                msg.value = {first: firstBuzz};

                sendToPlayer(msg, firstBuzz);
                sendToController(msg);
                sendToBoard(msg);
            }
            else if (messageType === 'question-response'){
                if (messageJSON.value.status === 'correct'){
                    // show question on board
                    // let player know
                    // add points to player score
                    msg.type = 'question-response';
                    msg.value = {status: 'correct', score: playerStatus[userName].score + points};
                    console.log("CORRECT :: new score " + msg.value.score);
                    sendToBoard(JSON.stringify(msg));
                    sendToPlayer(JSON.stringify(msg));
                }
                else{
                    // subtract points to player score
                    // re-enable buzzers
                    msg.type = 'question-response';
                    msg.value = {status: 'incorrect', score: playerStatus[userName].score - points};
                    console.log("CORRECT :: new score " + msg.value.score);
                    sendToBoard(JSON.stringify(msg));
                    sendToPlayer(JSON.stringify(msg));

                    // activate buzzers
                    // wait 500ms
                    setTimeout(activateBuzzer(),500);
                }
                
                
            }
            else if (messageType === 'start-final'){
                msg.type = 'start-final';
                msg.value = {category: messageJSON.value.category};

                for(let p in playerStatus){
                    msg.value[p] = playerStatus[p].score;
                }

                sendToAllPlayers(JSON.stringify(msg));
            }
            else if (messageType === 'final-wager') {
                finalJeopardyCount++;
                playerStatus[userName].fjWager = messageJSON.value.fjWager;


                if (finalJeopardyCount === gamePlayersConnection.length){
                    // everyone has submitted wager
                    // proceed with final jeopardy
                    finalJeopardyCount = 0;
                    msg.type = 'final-answer';
                    msg.value = {};

                    sendToBoard(JSON.stringify(msg));
                    sendToAllPlayers(JSON.stringify(msg));
                }
            }
            else if (messageType === 'final-response'){
                finalJeopardyCount++;
                playerStatus[userName].fjResponse = messageJSON.value.fjResponse;

                if (finalJeopardyCount === gamePlayersConnection.length){

                    msg.type = 'final-responses';
                    msg.value = {};

                    for(player in playerStatus){
                        msg.value[player] = {wager: player.fjWager};
                    }
                }

            }

            // else { // log and broadcast the message
            //     console.log((new Date()) + ' EVENT:: '
            //                 + userName + ': ' + message.utf8Data);
                
            //     // we want to keep history of all sent messages
            //     // var obj = {
            //     //     time: (new Date()).getTime(),
            //     //     text: htmlEntities(message.utf8Data),
            //     //     author: userName,
            //     //     color: userColor
            //     // };
            //     // history.push(obj);
            //     // history = history.slice(-100);

            //     // broadcast message to all connected clients
            //     var json = JSON.stringify({ type:'buzzer', data: obj });
            //     for (var i=0; i < clients.length; i++) {
            //         clients[i].sendUTF(json);
            //     }
            // }
        }
    });

    // user disconnected
    // save state of user for reconnect
    connection.on('close', function(connection) {
        if (userName !== false) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
            // push back user's color to be reused by another user
            // colors.push(userColor);
        }
    });

});