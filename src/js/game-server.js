"use strict";

import Message from './message';
import MessageTypes from './messageTypes';


process.title = 'jeopardy!';

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
let fs = require('fs');
let path = require('path');
let _ = require('lodash');

let gamesPath = './src/games-data/';

/**
 * Global variables
 */
var clients = [ ];

var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

var serve = serveStatic("./");


let gameStatus = {
    gameJSON: null,
    hostStatus: { connection: null, 
        roundNumber: 1,
        categories: null,
        title: null
    },
    roundData: {},
    playerStatus: {},
    boardStatus: { connection: null },
    playersConnections: [],
    gameSelected: false,
    currentQA: null,
    lastCorrectResponse: null
};

lastScore: null;

let points;
let buzzOrder = [];
let finalJeopardyCount = 0;




let finalJeopardyResponses;

function sendToBoard(message){
    message.log('OUT');
    try{
        clients[gameStatus.boardStatus.connection].sendUTF(message.toJSON());
    } catch(e)
    {
        console.log("NO GAME BOARD");
    }
}

function sendToController(message){
    message.log('OUT');
    try{
        clients[gameStatus.hostStatus.connection].sendUTF(message.toJSON());
    } catch(e){
        console.log("NO GAME CONTROLLER");
    }
}

function sendToPlayer(message, player){
    message.log();
    try{
        clients[player].sendUTF(message.toJSON());
    } catch(e){
        console.log("NO PLAYER - " + player);
    }
}

function sendToAllPlayers(message){
    message.log('OUT');
    let messageJSON = message.toJSON();
    for(var i = 0; i < gameStatus.playersConnections.length; i++){
        let p = gameStatus.playersConnections[i];
        try{
            clients[p].sendUTF(messageJSON);
        } catch(e){
            console.log("NO PLAYER - " + p);
        }
    }

}

function sendToAllConnections(message){
    message.log('OUT');
    let messageJSON = message.toJSON();
    for(var i = 0; i < clients.length; i++){
        clients[i].sendUTF(messageJSON);
    }
}

function activateBuzzer(){
    buzzOrder = [];
    let msg = new Message();
    msg.setType( MessageTypes.ACTIVATE_BUZZER);
    msg.setMessage({});
    sendToAllPlayers(msg);
}

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

function join(messageJSON, index, userName, connection) {
    let msg = new Message();
    let connectionType = messageJSON.message.connectionType;
    console.log("connection type: " + connectionType);
    // determine type of connection
    // and assign index to correct variable
    if (connectionType === 'board') {
        gameStatus.boardStatus.connection = index;
        catchupBoard();
        console.log("board: " + gameStatus.boardStatus.connection);
    } else if (connectionType === 'host') {
        gameStatus.hostStatus.connection = index;
        catchupHost();

        msg.setType(MessageTypes.HOST_JOIN);
        let availableGames = fs.readdirSync(gamesPath);
        availableGames = stripExtensions(availableGames)
        msg.setMessage({availableGames: availableGames});
        sendToController(msg);
    } else if (connectionType === 'player') {
        console.log("length");
        console.log(Object.keys(gameStatus.playerStatus).length);
        if (Object.keys(gameStatus.playerStatus).length < 3) {
            userName = messageJSON.message.name;
            console.log(userName + ' has joined');
            gameStatus.playersConnections.push(index);

            let playerNum = gameStatus.playersConnections.indexOf(index);

            // Set lastCorrectResponse should start as first player
            gameStatus.lastCorrectResponse = gameStatus.playersConnections[0];

            let player = {name: userName, score: 0, playerNum: playerNum, connectionNumber: index};

            msg.setType(MessageTypes.PLAYER_JOIN);
            msg.setMessage(player);
            sendToBoard(msg);
            sendToController(msg);

            if (!gameStatus.playerStatus[userName]) {
                gameStatus.playerStatus[userName] = player;
            }

            console.log("gameStatus.playerStatus");
            console.log(gameStatus.playerStatus);
        } else {
            console.log("too many players");
            msg.setType('error');
            msg.setMessage({errorType: 'tooManyPlayers', message: 'Too many players'});
            connection.send(msg);
        }

    } else {
        console.log("OOPS: unknown join :: " + messageJSON);
    }
    return userName;
}

function gameSelection(messageJSON) {
    let selectedGame = messageJSON.message.selectedGame;

    fs.readFile(gamesPath + selectedGame + '.json', 'utf8', function (err, data) {
        gameStatus.gameJSON = JSON.parse(data);

        gameStatus.hostStatus.categories = getCategories();
        gameStatus.hostStatus.title = gameStatus.gameJSON.game.title;

        let msg = new Message();
        msg.setType(MessageTypes.SETUP_ROUND);
        msg.setMessage({
            roundNumber: gameStatus.hostStatus.roundNumber,
            categories: gameStatus.hostStatus.categories,
            title: gameStatus.hostStatus.title
        });

        gameStatus.roundData = msg.message;

        sendToController(msg);

        console.log("gameStatus.boardStatus.connection: " + gameStatus.boardStatus.connection);
        if (gameStatus.boardStatus.connection !== null) {
            console.log("SENDING ROUND TO BOARD");
            sendToBoard(msg);
        } else {
            let intervalBoard = setInterval(function () {
                console.log("WAITING TO SEND TO BOARD");
                console.log("gameStatus.boardStatus.connection: " + gameStatus.boardStatus.connection);
                if (gameStatus.boardStatus.connection !== null) {
                    clearInterval(intervalBoard);
                    console.log("SENDING ROUND TO BOARD");
                    // msg.type = 'setupRound';
                    // msg.message = gameStatus.roundData;
                    sendToBoard(msg);
                }
            }, 1000);
        }


    });
}

function displayQuestion() {
    let msg = new Message();
    msg.setType(MessageTypes.SHOW_ANSWER);
    msg.setMessage({
        questionID: gameStatus.currentQA.questionID,
        category: gameStatus.currentQA.category,
        points: gameStatus.currentQA.pointValue,
        answer: gameStatus.currentQA.answer,
        question: gameStatus.currentQA.question
    });

    sendToController(msg);
    sendToBoard(msg);

    sendToAllPlayers(msg);
    // activate buzzers
    // wait 1000ms
    setTimeout(activateBuzzer, 1000);
}

function questionClick(messageJSON) {
    let questionId = messageJSON.message.questionID;
    let pointValue = messageJSON.message.pointValue;

    let currentQuestion = setCurrentQuestionAnswer(questionId, pointValue);

    if (currentQuestion.dailyDouble) {
        let msg = new Message();
        msg.setType(MessageTypes.GET_DAILY_DOUBLE_WAGER);
        msg.setMessage({
            category: gameStatus.currentQA.category,
            maxWager: gameStatus.hostStatus.roundNumber * 1000,
            playerNum: gameStatus.lastCorrectResponse,
            message: ''
        });
        sendToPlayer(msg, gameStatus.lastCorrectResponse);
        sendToController(msg);
    }
    else {
        displayQuestion();
    }
}

function buzzIn(index) {
    let firstBuzzConnection;
    let firstBuzzPlayer;

    //push player index to buzzOrder
    buzzOrder.push(index);
    console.log("BUZZ ORDER :: " + buzzOrder);

    //disable buzz-in
    let msg = new Message();
    msg.setType(MessageTypes.DISABLE_BUZZER);
    msg.setMessage({});
    sendToAllPlayers(msg);

    // first player in array
    firstBuzzConnection = buzzOrder[0];

    let player = _.filter(gameStatus.playerStatus, ['connectionNumber', firstBuzzConnection]);
    firstBuzzPlayer = player[0].playerNum;

    console.log("FIRST BUZZ :: " + player.name);

    msg = new Message();
    msg.setType(MessageTypes.FIRST_BUZZ);
    msg.setMessage({first: firstBuzzPlayer});

    sendToPlayer(msg, firstBuzzConnection);
    sendToController(msg);
    sendToBoard(msg);
}

function questionResponse(messageJSON) {
    let msg = new Message();
    let currentPlayer = messageJSON.message.player;
    console.log('PLAYER :: ' + currentPlayer + '\nStatus :: ' + messageJSON.message.status);
    if (messageJSON.message.status === 'correct') {
        // show question on board
        // let player know
        // add points to player score
        console.log("PLAYER STATUS");
        console.log(gameStatus.playerStatus);
        console.log("currentPlayer: " + currentPlayer);
        console.log(gameStatus.playerStatus[currentPlayer]);
        let player = gameStatus.playerStatus[currentPlayer];
        gameStatus.lastCorrectResponse = player.playerNum;
        player.score = player.score + parseInt(gameStatus.currentQA.pointValue);

        msg.setType(MessageTypes.RESPONSE_STATUS);
        msg.setMessage({
            player: player.playerNum,
            status: 'correct',
            score: player.score,
            question: gameStatus.currentQA.question
        });
        console.log("CORRECT :: new score " + msg.message.score);
        sendToBoard(msg);
        sendToController(msg);
        sendToPlayer(msg);

        msg.setType(MessageTypes.CLOSE_QUESTION);
        msg.setMessage({});

        sendToBoard(msg);
        sendToAllPlayers(msg);
    } else {
        // subtract points to player score
        // re-enable buzzers
        let player = gameStatus.playerStatus[currentPlayer];
        player.score = player.score - parseInt(gameStatus.currentQA.pointValue);
        msg.setType(MessageTypes.RESPONSE_STATUS);
        msg.setMessage({player: player.playerNum, status: 'incorrect', score: player.score});
        console.log("INCORRECT :: new score " + msg.message.score);
        sendToBoard(msg);
        sendToController(msg);
        sendToPlayer(msg);

        // activate buzzers
        // wait 500ms
        setTimeout(activateBuzzer, 1000);
    }
}

function closeQuestion(message) {
    let msg = new Message();
    msg.setType(MessageTypes.CLOSE_QUESTION);
    msg.setMessage({});

    sendToBoard(msg);
    sendToAllPlayers(msg);
}

function startFinal(messageJSON) {
    let msgBody = {category: messageJSON.message.category};

    for (let p in gameStatus.playerStatus) {
        msgBody[p] = gameStatus.playerStatus[p].score;
    }

    let msg = new Message();
    msg.setType(MessageTypes.START_FINAL);
    msg.setMessage(msgBody);

    sendToAllPlayers(msg);
}

function finalWager(userName, messageJSON) {
    finalJeopardyCount++;
    gameStatus.playerStatus[userName].fjWager = messageJSON.message.fjWager;


    if (finalJeopardyCount === gameStatus.playersConnections.length) {
        // everyone has submitted wager
        // proceed with final jeopardy
        finalJeopardyCount = 0;
        let msg = new Message();
        msg.setType(MessageTypes.FINAL_ANSWER);
        msg.setMessage({});

        sendToBoard(msg);
        sendToAllPlayers(msg);
    }
}

function finalResponse(userName, messageJSON) {
    finalJeopardyCount++;
    gameStatus.playerStatus[userName].fjResponse = messageJSON.message.fjResponse;

    if (finalJeopardyCount === gameStatus.playersConnections.length) {
        let msg = new Message();
        msg.setType(MessageTypes.FINAL_ALL_RESPONSES);
        let msgBody = {};

        let player;
        for (player in gameStatus.playerStatus) {
            msgBody[player] = {
                wager: player.fjWager,
                response: player.fjResponse,
                correct: null
            };
        }

        msg.setMessage(msgBody);
        msg.log('OUT');

        sendToController(msg);
        sendToBoard(msg);
    }
}

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

    // console.log((new Date()) + ' Connection accepted.');
    // console.log(clients);

    // // send back chat history
    // if (history.length > 0) {
    //     connection.sendUTF(JSON.stringify( { type: 'history', data: history} ));
    // }

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') { // accept only text

            let messageJSON = new Message().fromJSON(message.utf8Data);
            let messageType = messageJSON.type;

            messageJSON.log("IN");

            switch (messageJSON.getType()) {
                case MessageTypes.JOIN:
                    userName = join(messageJSON, index, userName, connection);
                    break;

                case  MessageTypes.GAME_SELECTION:
                    gameSelection(messageJSON);
                    break;

                case  MessageTypes.QUESTION_CLICK:
                    questionClick(messageJSON);
                    break;

                case  MessageTypes.BUZZ:
                    buzzIn(index);
                    break;

                case  MessageTypes.QUESTION_RESPONSE:
                    questionResponse(messageJSON);
                    break;

                case  MessageTypes.CLOSE_QUESTION:
                    closeQuestion(message);
                    break;

                case  MessageTypes.START_FINAL:
                    startFinal(messageJSON);
                    break;

                case  MessageTypes.FINAL_WAGER:
                    finalWager(userName, messageJSON);
                    break;

                case  MessageTypes.FINAL_PLAYER_RESPONSE:
                    finalResponse(userName, messageJSON);
                    break;

                default:
                    console.error('Unknown Message Type: ', messageJSON);
                    break;
            }
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

function stripExtensions(arr){
    let tempPath;
    for(let i = 0; i < arr.length ; i++){
         tempPath = path.parse(arr[i]);
         if(tempPath.ext == '.json'){
            arr[i] = tempPath.name;
        }
    }
    return arr;
}

function getCategories(){
    let round = gameStatus.hostStatus.roundNumber - 1;

    // console.log("gameStatus.gameJSON.rounds");
    // console.log(gameStatus.gameJSON.rounds);

    return Object.keys(gameStatus.gameJSON.rounds[round]);
}

function catchupBoard(){
    console.log("catchupBoard");
    let msg = new Message();
    msg.setType(MessageTypes.PLAYER_JOIN);
    if(!_.isEmpty(gameStatus.playerStatus)){
        console.log('BOARD JOIN :: Players');
        for (let player in gameStatus.playerStatus){
            //  ole.log(gameStatus.playerStatus[player]);
            msg.setMessage(Object.assign({},gameStatus.playerStatus[player]));
            // console.log(msg.message);
            sendToBoard(msg);
        }
    } 

    if(!_.isEmpty(gameStatus.hostStatus)){
        console.log('BOARD JOIN :: Host');
        let status = gameStatus.hostStatus;
        if(status.categories !== null && status.title !== null){
            msg.setType(MessageTypes.SETUP_ROUND);
            msg.setMessage({
                roundNumber: status.roundNumber,
                categories: status.categories,
                title: status.title
            });

            sendToBoard(msg);

        }

    }
    
}

function catchupHost(){
    console.log("catchupHost");
    let msg = new Message();
    msg.setType(MessageTypes.PLAYER_JOIN);
    if(!_.isEmpty(gameStatus.playerStatus)){
        console.log('HOST JOIN :: Players');
        for (let player in gameStatus.playerStatus){
            msg.message = Object.assign({},gameStatus.playerStatus[player]);
            // console.log(msg.message);
            sendToController(msg);
        }
    }
}

function boardJoin(){

}

function hostJoin(){

}

function logMessage(type, io, msg){
    console.log("============================");
    console.log(type);
    console.log(io);
    console.log(msg);
    console.log("============================");

}

function getCategory(categoryNumber){
    console.log("CATEGORIES::");
    console.log(gameStatus.hostStatus.categories);
    return gameStatus.hostStatus.categories[categoryNumber-1];
}

function splitQuestionId(questionID) {
    let categoryNumber = Math.floor(questionID / 10);
    let questionNumber = questionID % 10;
    return {categoryNumber, questionNumber};
}

function setCurrentQuestionAnswer(questionID, pointValue){
    let roundNumber = gameStatus.hostStatus.roundNumber;
    let {categoryNumber, questionNumber} = splitQuestionId(questionID);

    let category = getCategory(categoryNumber);
    console.log("category::");
    console.log(category);
    let qa = gameStatus.gameJSON.rounds[roundNumber-1][category][pointValue];

    let current = {
        questionID: questionID,
        category: category,
        pointValue: pointValue,
        answer: qa.answer,
        question: qa.question,
        dailyDouble: qa.dailyDouble
    };

    gameStatus.currentQA = current;

    logMessage("QA","STATUS",gameStatus.currentQA);

    return current;
}
