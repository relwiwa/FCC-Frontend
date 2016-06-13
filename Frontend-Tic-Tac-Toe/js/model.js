	/****************************************************
		MODEL myTTT.M
		---------------------------------------------------
	****************************************************/

	if (!myTTT) {
		var myTTT = {};	
	}

	myTTT.M = {
		
		turn: "", // "computer" || "human"
		difficulty: null, // "random" || "medium" || "impossible" 
		currentState: null,
		emptyCells: null,

		human: {
			avatar: null
		},
		
		computer: {
			
			avatar: null,
			
			/* nextMove function:
				- calls proper nextMove function depending on difficulty
				- updates emptyCells and currentState and calls C.handleComputerMove() */
			nextMove: function() {
				var nextMove = this["next" + myTTT.M.difficulty[0].toUpperCase() + myTTT.M.difficulty.substr(1) + "Move"]();
				nextMove = myTTT.M.emptyCells.splice(nextMove, 1);
				myTTT.M.currentState[nextMove] = this.avatar;
				myTTT.C.handleComputerMove(nextMove);
			},
			
			/* nextEasyMove function:
				- completely randomly selects next move of computer
				- nextMove is returned to and handled in nextMove function*/
			nextEasyMove: function() {
				console.log("playing next easy move");
				console.log(myTTT.M.currentState);
				var number = Math.floor(Math.random() * myTTT.M.emptyCells.length);
				console.log(number);
				return number;
			},
			
			/* nextMediumMove function:
				- TO BE DONE: will toggle between perfect and random play */
			nextMediumMove: function() {
				console.log("playing next medium move");
				this.nextEasyMove();
			},
			
			/* nextImpossibleMove function:
				- TO BE DONE: will play perfectly all the time using minimax algorithm */
			nextImpossibleMove: function() {
				console.log("playing next impossible move");
				this.nextEasyMove();
			}
			
		},
		
		/* start function:
			- initializes or resets currentState and emptyCells
			- determines, whose turn it is depending on difficulty */
		start: function() {
			this.currentState = ["", "", "", "", "", "", "", "", ""];
			this.emptyCells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
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
		
		/* isGameOver function:
			- checks whether the game is over
			- check only takes place when more than 2 cells have been played
			- runs through currentState
			- returns object with gameOver property and/or winner and cells property
			- also checks for a win via multiple rows */
		isGameOver: function() {
			var result = {};
			result.cells = [];
			result.gameOver = false;
			
			if (this.emptyCells.length >= 8) {
				console.log("less than 2 entries, no check necessary");
			}
			else {
				var tds = this.currentState;
				for (var i = 0; i < 9; i += 3) {
					if (tds[i] !== "") {
						// rows
						console.log("checking row " + i/3);
						if (tds[i] === tds[i + 1] && tds[i + 1] === tds[i + 2]) {
							console.log("row win");
							result.gameOver = true;
							result.winner = this.turn;
							result.cells.push(i, i + 1, i + 2);
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
							result.gameOver = true;
							result.winner = this.turn;
							result.cells.push(i/3, i/3 + 3, i/3 + 6);
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
						result.gameOver = true,
						result.winner = this.turn;
						result.cells.push(0, 4, 8);
					}
				}

				if (tds[2] !== "") {
					if (tds[2] === tds[4] && tds[4] === tds[6]) {
						console.log("diagonal 2 4 6 wins");
						result.gameOver = true,
						result.winner = this.turn;
						result.cells.push(2, 4, 6);
					}
				}

				if (this.emptyCells.length === 0 && result.gameOver === false) {
					console.log("its a tie");
					result.gameOver = true;
					result.winner = "tie";
				}
			}
			console.log(result);
			return result;
		}

	}; // end myTTT.M