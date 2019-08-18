import Message from './message';
import MessageTypes from './messageTypes';

let qaModal = $("#qaModal");
let qaTitle = $('#qaTitle');
let qaAnswer = $('#qaAnswer');
let qaQuestion = $('#qaQuestion');
let playerDiv = $('#player');


function setupBoard(roundNo, categories, title){
	// gameJSON = initJSON();
	$('#title').html(title);
	let catNo = 1;
	let questionNo = 1;
	
	// console.log("categories");
	// console.log(categories);

	for (let i = 1; i <=6; i++){
		$('#cat' + i).html(categories[i-1]);
	}

	for(let i = 1; i <= 5; i++){
		let rowScore = i * roundNo * 100;
		$('.row' + i).html(rowScore);
	}

	$('.question').bind('click', function(){
		questionClick($(this).attr('id'));
	});

	$('#configuration').addClass('hidden');
	$('#game-board').removeClass('hidden');
}

// function getQuestionAnswer(questionID, pointValue){
// 	let ret = {};
// 	let category = Math.floor(questionID / 10);
// 	let questionNumber = questionID % 10;
// 	let qa = roundJSON[category][questionNumber];
// 	ret.category = roundJSON[category].category;
// 	ret.answer = qa.answer;
// 	ret.question = qa.question;
// 	ret.pointValue = pointValue;
// 	return ret;
// }

function displayQA(qa){
	console.log("QA");
	console.log(qa);
	// questionAnswer = getQuestionAnswer(questionID, pointValue);

	//show answer
	qaTitle.html(qa.category + ' - ' + qa.points);
	qaAnswer.html(qa.answer);
	
	if(isHost){
		qaQuestion.html(qa.question);
		playerDiv.show();

	} else {
		qaQuestion.html('');
		playerDiv.hide();
	}


	qaModal.modal();

	// console.log('isHost: '+ isHost)
	// if(isHost){
	// 	msg = {
	// 		type: "sendQA",
	// 		value: {
	// 			questionID: questionID,
	// 			ans: qa.answer,
	// 			cat: qa.category,
	// 			ques: qa.question,
	// 			pts: qa.pointValue
	// 		}
	// 	}


	//}

}

function disableQuestion(questionID){
	// console.log(questionID);
	let div = $('#'+ questionID);
	let pointValue = div.html();
	div.html('');
	div.unbind('click');
	return pointValue;
}

function questionClick(questionID){
	let pointValue = disableQuestion(questionID);
	
	// sendQA(questionID, pointValue);
	let msg = new Message();
	msg.type = MessageTypes.QUESTION_CLICK;
	let msgBody = {
		questionID: questionID,
		pointValue: pointValue,
	};

	msg.message = msgBody;

	connection.send(msg.toJSON());

}

function receiveQA(){
	
}

function playRound(){
	// while(questionsRemaining){
	// 	console.log('keep playing');
	// }
}

function showAnswer(){

}

function revealQuestion(){

}
