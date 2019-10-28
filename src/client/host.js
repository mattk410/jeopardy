import Message from '../../shared/message';
import MessageTypes from '../../shared/messageTypes';
import React from "react";

// let connection;
//
// let isHost = true;
// let respondingPlayerNumber;
//
// function playerJoin(messageJSON, players) {
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
// function hostJoin(messageJSON) {
//     let games = messageJSON.message.availableGames;
//     console.log("games");
//     console.log(games);
//     displayGames(games);
// }
//
// function setupRound(messageJSON) {
//     let roundNumber = messageJSON.message.roundNumber;
//     let categories = messageJSON.message.categories;
//     let title = messageJSON.message.title;
//     setupBoard(roundNumber, categories, title);
// }
//
// function setupFinal(messageJSON) {
//
// }
//
// function firstBuzz(messageJSON, players) {
//     console.log('firstBuzz');
//     console.log("First Value :: " + messageJSON.message.first);
//
//     let playerName = players[messageJSON.message.first].name;
//
//     $('#playerName').text(playerName);
//     $('#player').show();
//
//     respondingPlayerNumber = messageJSON.message.first;
// }
//
// function responseStatus(players, messageJSON) {
//     let playerScoreElt = players[messageJSON.message.player].scoreElt;
//     playerScoreElt.text(messageJSON.message.score);
// }
//
// function closeQuestionDialog() {
//     $('#playerName').text('');
//     $('#qaModal').modal('hide');
// }
//
// function submitDailyDoubleWager() {
//     let wager = $('#dailyDoubleWager').text('');
//
//     try {
//         wager = parseInt(wager);
//     }
//     catch (e) {
//         $('#dailyDoubleMessage').val('Invalid value');
//         return;
//     }
//
//
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
//         let msg = new Message();
//         msg.type = MessageTypes.JOIN;
//         msg.message = {connectionType: "host"};
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
//         // try to parse JSON message. Because we know that the server always returns
//         // JSON this should work without any problem but we should make sure that
//         // the massage is not chunked or otherwise damaged.
//         let messageJSON, messageType;
//         try {
//             messageJSON = new Message().fromJSON(message.data);
//             messageType = messageJSON.type;
//         } catch (e) {
//             console.log('This doesn\'t look like a valid JSON: ', message.data);
//             return;
//         }
//         console.log(messageJSON);
//
//         switch (messageType) {
//             case messageJSON.MessageTypes.PLAYER_JOIN:
//                 playerJoin(messageJSON, players);
//                 break;
//
//             case messageJSON.MessageTypes.HOST_JOIN:
//                 hostJoin(messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.SETUP_ROUND:
//                 setupRound(messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.START_FINAL:
//                 setupFinal(messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.SHOW_ANSWER:
//                 displayQA(messageJSON.message);
//                 break;
//
//             case messageJSON.MessageTypes.FIRST_BUZZ:
//                 firstBuzz(messageJSON, players);
//                 break;
//
//             case messageJSON.MessageTypes.RESPONSE_STATUS:
//                 responseStatus(players, messageJSON);
//                 break;
//
//             case messageJSON.MessageTypes.CLOSE_QUESTION:
//                 closeQuestionDialog();
//                 break;
//
//             default:
//                 console.error('Unknown Message Type:', messageJSON);
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
//             console.log('Unable to comminucate '
//                                                  + 'with the WebSocket server.');
//         }
//     }, 3000);
//
//
//     function markPlayerResponse(status){
//         if (!$('#playerName').text()) {
//             alert('No Player Buzzed');
//             return;
//         }
//         let msg = new Message();
//         msg.type = MessageTypes.QUESTION_RESPONSE;
//         msg.message = {
//             status: status,
//             player: $('#playerName').text()
//         };
//         msg.log('OUT');
//         connection.send(msg.toJSON());
//     }
//
//     $('#correct').click(event => {
//         markPlayerResponse(event.target.id);
//         closeQuestion();
//     });
//
//     $('#incorrect').click(event => {
//         markPlayerResponse(event.target.id);
//         $('#player').hide();
//     });
//
//     $('#dailyDoubleSubmit').click(event => {
//        submitDailyDoubleWager();
//     });
// });
//
//
// function displayGames(games){
//     for (let i = 0; i < games.length; i++){
//         console.log(games[i]);
//         $('#select-game').append('<button id = "' + games[i] + '" type="button" class="btn btn-default game-option">' + games[i] + '</button>');
//     }
//
//     $('#select-game').append('<button type="button" class="btn btn-default" disabled>Upload new</button>');
//
//     $('.game-option').click(function(){
//         let selectedGame = this.id;
//         console.log('this');
//         console.log(this);
//         console.log("selectedGame: " + selectedGame);
//
//         let msg = new Message();
//         msg.type = MessageTypes.GAME_SELECTION;
//         msg.message = { selectedGame : selectedGame };
//
//         connection.send(msg.toJSON());
//         $('#select-game').remove();
//         console.log('removed');
//     })
// }
//
// function closeQuestion(){
//     console.log('closeQuestion');
//     $('#player').hide();
//     let msg = new Message();
//     msg.type = MessageTypes.CLOSE_QUESTION;
//     connection.send(msg.toJSON());
//     closeQuestionDialog();
// }
//
// $('#closeQuestion').click(() => {
//         closeQuestion();
// });


class Host extends React.Component {


    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <div className={'host'}>
                <h1>I'm a host</h1>
            </div>
        )
    }
}

export default Host;