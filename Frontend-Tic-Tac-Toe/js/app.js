/*******************************************************
	BUILD A TIC TAC TOE GAME
	-------------------------------------------------------
	A project for FreeCodeCamp's Frontend Certification
	-------------------------------------------------------
	fulfilled by Walter (github.com/relwiwa)
	-------------------------------------------------------
*******************************************************/

$(document).ready(function() {

	var myTTT = {};
	
	
	/****************************************************
		MODEL myTTT.M
		---------------------------------------------------
	****************************************************/

	myTTT.M = {
		
		turn: "", // "computer" || "human"
		difficulty: "", // "random" || "medium" || "impossible" 
		currentState: null,
		emptyCells: null,

		human: {
			avatar: null
		},
		
		computer: {
			
			avatar: null,
			
			nextMove: function() {
				this["next" + myTTT.M.difficulty[0].toUpperCase() + myTTT.M.difficulty.substr(1) + "Move"]();
			},
			
			nextEasyMove: function() {
				console.log("playing next easy move");
				console.log(myTTT.M.currentState);
				var number = Math.floor(Math.random() * myTTT.M.emptyCells.length);
				console.log(number);
				number = myTTT.M.emptyCells.splice(number, 1);
				myTTT.M.currentState[number] = this.avatar;
				myTTT.C.handleComputerMove(number);
			},
			
			nextMediumMove: function() {
				console.log("playing next medium move");
				this.computer.nextEasyMove();
			},
			
			nextImpossibleMove: function() {
				console.log("playing next impossible move");
				this.nextEasyMove();
			}
			
		},
		
		initialize: function() {
			this.currentState = ["", "", "", "", "", "", "", "", ""];
			this.emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
		},
		
		start: function() {
			if (this.difficulty === "easy") {
				this.turn = "human";
			}
			else if (this.difficulty === "medium") {
				if (Math.random() > 0.5) {
					this.turn = "human";
				}
				else {
					this.turn = "computer";
				}
			}
			else {
				this.turn = "computer";
			}
		},
		
		isGameOver: function() {
			if (this.emptyCells.length >= 8) {
				console.log("less than 2 entries, no check necessary");
				return {
					gameOver: false
				};
			}
			else {
				var tds = this.currentState;
				for (var i = 0; i < 9; i += 3) {
					if (tds[i] !== "") {
						// rows
						console.log("checking row " + i/3);
						if (tds[i] === tds[i + 1] && tds[i + 1] === tds[i + 2]) {
							console.log("row win");
							return {
								gameOver: true,
								winner: this.turn,
								cells: [i, i + 1, i + 2]
							};
						}
						else {
							console.log("no final state in row: " + (i/3));
						}
					}
					else {
						console.log((i)%3 + " is empty, so no checking of row " + (i/3));
					}

					// cols
					if (tds[i/3] !== "") {
						console.log("checking col " + i/3);
						if (tds[i/3] === tds[i/3 + 3] && tds[i/3 + 3] === tds[i/3 + 6]) {
							console.log("col win");
							return {
								gameOver: true,
								winner: this.turn,
								cells: [i/3, i/3 + 3, i/3 + 6]
							};
						}
						else {
							console.log("no final state in col: " + i/3);
						}
					}
					else {
						console.log(i/3 + " is empty, so no checking of col " + i/3);
					}
				}
			
				// diagonals
				if (tds[0] !== "") {
					if (tds[0] === tds[4] && tds[4] === tds[8]) {
						console.log("diagonal 0 4 8 wins");
						return {
							gameOver: true,
							winner: this.turn,
							cells: [0, 4, 8]
						};
					}
				}

				if (tds[2] !== "") {
					if (tds[2] === tds[4] && tds[4] === tds[6]) {
						console.log("diagonal 2 4 6 wins");
						return {
							gameOver: true,
							winner: this.turn,
							cells: [2, 4, 6]
						};
					}
				}

				if (this.emptyCells.length === 0) {
					console.log("its a tie");
					return {
						gameOver: true,
						winner: "tie"
					}
				}
				
				console.log("no winner yet");
				return {
					gameOver: false
				};
			}
		}

	}; // end myTTT.M


	/****************************************************
		CONTROLLER myTTT.C
		---------------------------------------------------
	****************************************************/	
	
	myTTT.C = {
		
		initialize: function() {
			myTTT.V.setupOptions();
			myTTT.M.initialize();
		},
		
		updateDifficulty: function(d) {
			myTTT.M.difficulty = $(d).val();
			this.isGameReady();
		},
		
		updateAvatars: function(human, computer) {
			myTTT.M.human.avatar = $(human).val();
			myTTT.V.human.avatarHTML = $(human).html();
			myTTT.M.computer.avatar = $(computer).val();
			myTTT.V.computer.avatarHTML = $(computer).html();
			this.isGameReady();
		},
		
		/* isGameReady:
			- if both difficulty and avatar are chosen, show play button to start game */
		isGameReady: function() {
			if (myTTT.M.difficulty !== null && myTTT.M.human.avatar !== null) {
				$("#play").show();
			}
		},
		
		startGame: function() {
			myTTT.M.start();
			myTTT.V.start(myTTT.M.turn).then(function(x) {
				myTTT.C.nextMove();
			});
		},
		
		/* nextMove function:
			- forwards to next human or computer move functions
			- check for game end is done in respective handle*Move functions */
		nextMove: function() {
			if (myTTT.M.turn === "human") {
				myTTT.V.setupHumanMove(myTTT.M.emptyCells);
			}
			else {
				myTTT.M.computer.nextMove();
			}
		},
		
		handleHumanMove: function(move) {
			myTTT.V.suspendHumanAction(myTTT.M.emptyCells);
			myTTT.M.currentState[move] = myTTT.M.human.avatar;
			myTTT.M.emptyCells.splice(myTTT.M.emptyCells.indexOf(move), 1);
			myTTT.V.showMove("human", move);
			var rslt = myTTT.M.isGameOver();
			if (rslt.gameOver === false) {
				myTTT.M.turn = "computer";
				myTTT.V.updateTurn(myTTT.M.turn);
//				window.setTimeout(function() {
					myTTT.C.nextMove();
	//			}, 2000);
			}
			else {
				console.log("game over");
				this.endGame(rslt);
			}
		},
		
		handleComputerMove: function(move) {
			myTTT.V.showMove("computer", move);
			var rslt = myTTT.M.isGameOver();
			if (rslt.gameOver === false) {
				myTTT.M.turn = "human";
				myTTT.V.updateTurn(myTTT.M.turn);
				this.nextMove();
			}
			else {
				console.log("game over");
				this.endGame(rslt);
			}
		},
		
		endGame: function(rslt) {
			myTTT.V.endGame(rslt);
		}

	}; // end myTTT.C

	
	/****************************************************
		VIEW myTTT.V
		---------------------------------------------------
	****************************************************/	
	
	myTTT.V = {
		
		human: {
			avatarHTML: null
		},
		
		computer: {
			avatarHTML: null
		},
		
		setupOptions: function() {
			$("#choose-difficulty button").click(function() {
				$("#choose-difficulty button").removeClass("btn-active").addClass("btn-default");
				$(this).removeClass("btn-default").addClass("btn-active");
				$("#difficulty").text($(this).text());
				myTTT.C.updateDifficulty(this);
			});
			
			$("#choose-avatar button").click(function() {
				$("#choose-avatar button").removeClass("btn-active").addClass("btn-default");
				$(this).removeClass("btn-default").addClass("btn-active");
				$("#human").html($(this).html());
				$("#computer").html($("#choose-avatar button.btn-default").html());
				myTTT.C.updateAvatars(this, $("#choose-avatar button.btn-default"));
			});
			
			$("#play").click(function() {
				myTTT.C.startGame();
			});
			
			$("#play-again").click(function() {
				console.log("play again");
			});
			
			$("#change-options").click(function() {
				console.log("change options");
			})
		},

		start: function(turn) {
			$("#" + turn).addClass("text-primary");
			var d = $.Deferred(function() {
				$("#ttt-options").fadeOut(600).promise().then(function() {
					$("#ttt-game").fadeIn(600).promise().then(function() {
						d.resolve();
					});
				});
			});
			return d.promise();
		},
		
		setupHumanMove: function(emptyCells) {
			console.log("setupHumanMove");
			var cells = $(".x-o");
			for (var i = 0; i < emptyCells.length; i++) {
				// IIFE to make i available via closure
				(function(el) {
					cells.eq(emptyCells[i]).click(function() {
						myTTT.C.handleHumanMove(el);
					});
				})(emptyCells[i]);
			}
		},
		
		suspendHumanAction: function(emptyCells) {
			var cells = $(".x-o");
			for (var i = 0; i < emptyCells.length; i++) {
				cells.eq(emptyCells[i]).off();
			}
		},
		
		/* updateTurn function:
			- toggles avatar of human or computer, depending on whose turn it is
			- initial setup in myTTT.V.start function */
		updateTurn: function(turn) {
			$("#computer").toggleClass("text-primary");
			$("#human").toggleClass("text-primary");
		},
		
		showMove: function(actor, move) {
			$(".x-o div span").eq(move).html(this[actor].avatarHTML);
		},
		
		endGame: function(rslt) {
			if (rslt.winner === "tie") {
				$("#ttt-result div").removeClass("alert-info", "alert-warning", "alert-danger").addClass("alert-warning").children("#result").text("It's a tie!");
				$("#ttt-result").fadeIn();
			}
			else {
				var divs = $(".x-o");
				for (var i = 0; i < 3; i++) {
					divs.eq(rslt.cells[i]).addClass("text-primary");
				}
				if (rslt.winner === "computer") {
					$("#ttt-result div").removeClass("alert-info", "alert-warning", "alert-danger").addClass("alert-danger").children("#result").text("You lost!");
					$("#ttt-result").fadeIn();
				}
				else {
					$("#ttt-result div").removeClass("alert-info", "alert-warning", "alert-danger").addClass("alert-info").children("#result").text("You won!");
					$("#ttt-result").fadeIn();
				}
			}
		}

	} // end myTTT.V

	myTTT.C.initialize();
	
});