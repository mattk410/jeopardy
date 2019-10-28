const MessageTypes = {
    'JOIN' : 'join',
    'ACTIVATE_BUZZER' : 'activateBuzzer',
    'HOST_JOIN' : 'hostJoin',
    'PLAYER_JOIN' : 'playerJOIN',
    'BOARD_JOIN' : 'boardJoin',
    'ERROR' : 'error',
    'SETUP_ROUND': 'setupRound',
    'SHOW_ANSWER' : 'showAns',
    'SHOW_QUESTION' : 'showQues',
    'DISABLE_BUZZER' : 'disableBuzzer',
    'FIRST_BUZZ' : 'firstBuzz',
    'RESPONSE_STATUS' : 'responseStatus',
    'START_FINAL' : 'startFinal',
    'FINAL_WAGER' : 'finalWager',
    'FINAL_ANSWER' : 'finalAnswer',
    'FINAL_PLAYER_RESPONSE' : 'finalResponse',
    'FINAL_ALL_RESPONSES' : 'finalResponsesAll',
    'QUESTION_CLICK' : 'questionClick',
    'BUZZ' : 'buzz',
    'QUESTION_RESPONSE' : 'questionResponse',
    'CLOSE_QUESTION' : 'closeQuestion',
    'GAME_SELECTION' : 'gameSelection',
    'CORRECT_QUESTION' : 'correctQuestion',
    'START_GAME' : 'startGame'
};

export default MessageTypes;