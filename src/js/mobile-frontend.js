"use strict";

import Message from './message';
import MessageTypes from './messageTypes';


let connection;
let nameBox = $('#username');
let qaBox = $('#qa');
let categoryHTML = $('#category');
let answerHTML = $('#answer');
let buzzer = $('#buzzer');


function buzzin(){
    buzzer.hide();
    let msg = new Message();
    msg.type = MessageTypes.BUZZ;
    msg.message = {};
    connection.send(msg.toJSON());
}



// join game if user presses enter
$(nameBox).keypress(function(event){
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == 13){
        join();
    }
})

// on page load, check if browser supports WebSocket
$(function(){
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    // if browser doesn't support WebSocket, just show some notification and exit
    if (!window.WebSocket) {
        content.html($('<p>', { text: 'Sorry, but your browser doesn\'t '
                                    + 'support WebSockets.'} ));
        welcome.hide();
        $('span').hide();
        return;
    }
});


function startGame() {
    $('#welcome').remove();
    qaBox.show();
}

function showAnswer(message) {
    console.log(message.getMessage());
    receiveQA(message.getMessage());
}

function firstBuzz() {
    console.log('firstBuzz');
    alert('firstBuzz');
}

function closeQuestion() {
    buzzer.hide();
    categoryHTML.html('');
    answerHTML.html('');
}

function join() {
    console.log("join");
    if(nameBox.val() === ''){
        return;
    }

    let myName = nameBox.val();
    let msg = new Message();

    msg.type = MessageTypes.JOIN;
    msg.message = { connectionType: 'player', name: myName};

    // hide welcome div
    $('#welcome').hide();
    // $('#welcome').empty();
    // $('#welcome').append('<h1>Please wait...</h1>');
    

    // open connection
    connection = new WebSocket('ws://127.0.0.1:1337');

    connection.onopen = function () {
        connection.send(msg.toJSON());
    };

    connection.onerror = function (error) {
        // just in there were some problems with conenction...
        content.html($('<p>', { text: 'Sorry, but there\'s some problem with your '
                                    + 'connection or the server is down.' } ));
    };

    // most important part - incoming messages
    connection.onmessage = function (message) {
        let messageJSON, messageType;
        try {
             messageJSON = new Message().fromJSON(message.data);
             messageType = messageJSON.type;
        } catch (e) {
            console.log('This doesn\'t look like a valid JSON: ', message.data);
            return;
        }

        switch (messageType) {
            case MessageTypes.START_GAME:
                startGame();
                break;

            case MessageTypes.SHOW_ANSWER:
                showAnswer(messageJSON);
                break;

            case MessageTypes.ACTIVATE_BUZZER:
                buzzer.show();
                break;

            case MessageTypes.DISABLE_BUZZER:
                buzzer.hide();
                break;

            case MessageTypes.FIRST_BUZZ:
                firstBuzz();
                break;

            case MessageTypes.CLOSE_QUESTION:
                closeQuestion();
                break;

            default:
                console.error('Unknown Message Type:', messageJSON);
        }
    };

    /**
     * This method is optional. If the server wasn't able to respond to the
     * in 3 seconds then show some error message to notify the user that
     * something is wrong.
     */
    setInterval(function() {
        if (connection.readyState !== 1) {
            // status.text('Error');
            console.log('Unable to comminucate '
                                                 + 'with the WebSocket server.');
        }
    }, 3000);

    /**
     * Add message to the chat window
     */
    function addMessage(author, message, dt) {
        content.prepend('<p><span>' + author + '</span> @ ' +
             + (dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours()) + ':'
             + (dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes())
             + ': ' + message + '</p>');
    }
}


function receiveQA(qa) {
    qaBox.hide();
    categoryHTML.text(qa.category + ' | ' + qa.points);
    answerHTML.text(qa.answer);
    qaBox.show()
}
