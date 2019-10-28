import Message from '../../shared/message';
import MessageTypes from '../../shared/messageTypes';
import React from "react";

// let connection;
//
// let isHost = false;
//
// function playerJoin(messageJSON, players) {
//     // set player's name
//     let playerNum = messageJSON.message.playerNum;
//     let playerName = messageJSON.message.name;
//
//     let player = players[playerNum];
//     console.log(player);
//
//     player.name = playerName;
//
//     player.nameElt.text(playerName);
// }
//
// function setupRound(messageJSON) {
//     let roundNumber = messageJSON.message.roundNumber;
//     let categories = messageJSON.message.categories;
//     let title = messageJSON.message.title;
//     setupBoard(roundNumber, categories, title);
// }
//
// function correctQuestion() {
//     console.log("correctQuestion");
//     $('#qaModal').modal('hide');
// }
//
// function closeQuestion() {
//     $('#qaModal').modal('hide');
// }
//
// function firstBuzz() {
//     //TODO
//     console.log("firstBuzz");
// }
//
// function responseStatus(players, messageJSON) {
//     let playerScoreElt = players[messageJSON.message.player].scoreElt;
//     playerScoreElt.text(messageJSON.message.score);
// }
//
// $(function () {
//     "use strict";
//
//     // for better performance - to avoid searching in DOM
//     let players = [];
//     players.push({ nameElt: $('#name1'), scoreElt: $('#score1')});
//     players.push({ nameElt: $('#name2'), scoreElt: $('#score2')});
//     players.push({ nameElt: $('#name3'), scoreElt: $('#score3')});
//     console.log(players);
//
//     // my color assigned by the server
//     // let myColor = false;
//     // my name sent to the server
//     // let myName = false;
//
//     // if user is running mozilla then use it's built-in WebSocket
//     window.WebSocket = window.WebSocket || window.MozWebSocket;
//
//     // if browser doesn't support WebSocket, just show some notification and exit
//     if (!window.WebSocket) {
//         content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
//                                     + 'support WebSockets.'} ));
//         // input.hide();
//         // $('span').hide();
//         return;
//     }
//
//     // open connection
//     connection = new WebSocket('ws://127.0.0.1:1337');
//
//     connection.onopen = function () {
//         // first we want users to enter their names
//         // input.removeAttr('disabled');
//         // status.text('Choose name:');
//         console.log("connection opened");
//
//         let msg = new Message();
//         msg.type = MessageTypes.JOIN;
//         msg.message = {connectionType: "board"};
//
//         connection.send(msg.toJSON());
//
//     };
//
//     connection.onerror = function (error) {
//         // just in there were some problems with conenction...
//         content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
//                                     + 'connection or the server is down.' } ));
//     };
//
//     // most important part - incoming messages
//     connection.onmessage = function (message) {
//         let messageJSON, messageType;
//         try {
//             messageJSON = new Message().fromJSON(message.data);
//             messageType = messageJSON.type;
//         } catch (e) {
//             console.log('This doesn\'t look like a valid JSON: ', message.data);
//             return;
//         }
//
//         switch (messageType) {
//             case messageJSON.MessageTypes.PLAYER_JOIN:
//                 playerJoin(messageJSON, players);
//                 break;
//
//             case messageJSON.MessageTypes.SETUP_ROUND:
//                 setupRound(messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.SHOW_ANSWER:
//                 disableQuestion(messageJSON.getMessage().questionID);
//                 displayQA(messageJSON.getMessage());
//                 break;
//
//             case messageJSON.MessageTypes.CORRECT_QUESTION:
//                 correctQuestion();
//                 break;
//
//             case messageJSON.MessageTypes.CLOSE_QUESTION:
//                 closeQuestion();
//                 break;
//
//             case messageJSON.MessageTypes.RESPONSE_STATUS:
//                 responseStatus(players, messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.FIRST_BUZZ:
//                 firstBuzz();
//                 break;
//
//             default:
//                 console.error('Unknown Message Type:', messageJSON);
//
//         }
//     };
//
//     /**
//      * This method is optional. If the server wasn't able to respond to the
//      * in 3 seconds then show some error message to notify the user that
//      * something is wrong.
//      */
//     setInterval(function() {
//         if (connection.readyState !== 1) {
//             // status.text('Error');
//             console.log('Unable to comminucate with the WebSocket server.');
//         }
//     }, 3000);
//
// });
//
// function receiveQA(qa) {
//     $('#qaModal').modal('hide');
//     $('#qaTitle').text(qa.category + ' | ' + qa.pointValue);
//     $('#qaAnswer').text(qa.answer);
//     $('#qaQuestion').text(qa.question);
//     $('#qaQuestion').hide();
//     $('#qaModal').modal('show');
// }

class Board extends React.Component {


    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className={'board'}>
                <h1>I'm a board</h1>
            </div>
        )
    }
}

export default Board;