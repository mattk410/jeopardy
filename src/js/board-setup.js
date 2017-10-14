let gameJSON;
let roundJSON;
let questionsRemaining = 6 * 5;
let qaModal = $("#qaModal");
let qaTitle = $('#qaTitle');
let qaText = $('#qaText');
let questionAnswer;
let msg;

function setupBoard(roundNo){
	gameJSON = initJSON();
	$('#title').html(gameJSON.game.title);
	let catNo = 1;
	let questionNo = 1;
	let roundNumber = 'round' + roundNo;
	roundJSON = gameJSON[roundNumber];
	Object.keys(roundJSON).forEach(function (key){
		$('#cat' + catNo).html(roundJSON[catNo].category);

		catNo++;
	})

	for(let i = 1; i <= 5; i++){
		let rowScore = i * roundNo * 100;
		$('.row' + i).html(rowScore);
	}

	$('.question').bind('click', function(){
		questionClick($(this).attr('id'));
	});
}

function getQuestionAnswer(questionID, pointValue){
	let ret = {};
	let category = Math.floor(questionID / 10);
	let questionNumber = questionID % 10;
	// let temp = roundJSON['category' + category];
	// console.log(roundJSON);
	let qa = roundJSON[category][questionNumber];
	ret.category = roundJSON[category].category;
	ret.answer = qa.answer;
	ret.question = qa.question;
	ret.pointValue = pointValue;
	return ret;
}

function displayQA(questionID, pointValue){
	questionAnswer = getQuestionAnswer(questionID, pointValue);

	//show answer
	qaTitle.html(questionAnswer.category + ' - ' + questionAnswer.pointValue);
	qaText.html(questionAnswer.answer);
	qaModal.modal();

	msg = {
		type: "enable",
		text: questionAnswer.answer
	}

	connection.send(JSON.stringify(msg));

}

function questionClick(questionID){
		console.log(questionID);
		let div = $('#'+ questionID);
		let pointValue = div.html();
		div.html('');
		div.unbind('click');

		displayQA(questionID, pointValue);

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


function runGame(){
	let round = 1,
		numRounds = 1;

	while(round <= numRounds){
		setupBoard(round);
		// playRound(round);
		round++;
	}

}

runGame();

function initJSON(){
return {
	"game" : {
		"title": "Jeopardy!"
	},
	"round1" : {
		"1" : {
			"category": "category1",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"2" : {
			"category": "category2",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"3" : {
			"category": "category3",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}

		},
		"4" : {
			"category": "category4",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"5" : {
			"category": "category5",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"6" : {
			"category": "category6",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
	},
	"round2" : {
		"1" : {
			"category": "category1",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"2" : {
			"category": "category2",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4": {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"3" : {
			"category": "category3",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}

		},
		"4" : {
			"category": "category4",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"5" : {
			"category": "category5",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
		"6" : {
			"category": "category6",
			"1" : {
				"answer" : "answer",
				"question" : "question"
			},
			"2" : {
				"answer" : "answer",
				"question" : "question"
			},
			"3" : {
				"answer" : "answer",
				"question" : "question"
			},
			"4" : {
				"answer" : "answer",
				"question" : "question"
			},
			"5" : {
				"answer" : "answer",
				"question" : "question"
			}
		},
	},
	"final" : {
		"category" : "final category",
		"answer" : "The Answer",
		"question" : "What is the question?"
	}
};
}