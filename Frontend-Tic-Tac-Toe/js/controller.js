	/****************************************************
		CONTROLLER myTTT.C
		---------------------------------------------------
	****************************************************/	

	if (!myTTT) {
		var myTTT = {};	
	}

	myTTT.C = {
		
		/* initialize function:
			- make view display the game options */
		initialize: function() {
			myTTT.V.setupOptions();
		},
		
		/* updateDifficulty function:
			- when user chooses/changes difficulty, update model data
			- when both difficulty and avatar are checked, show play button */
		updateDifficulty: function(d) {
			myTTT.M.difficulty = $(d).val();
			this.isGameReady();
		},

		/* updateAvatars function:
			- when user chooses/changes avatar, update avatars in model (x or o) and
				in view (html fragment)
			- when both difficulty and avatar are checked, show play button */
		updateAvatars: function(human, computer) {
			myTTT.M.human.avatar = $(human).val();
			myTTT.V.human.avatarHTML = $(human).html();
			myTTT.M.computer.avatar = $(computer).val();
			myTTT.V.computer.avatarHTML = $(computer).html();
			this.isGameReady();
		},
		
		/* isGameReady function:
			- if both difficulty and avatar are chosen, show play button to start
				game */
		isGameReady: function() {
			if (myTTT.M.difficulty !== null && myTTT.M.human.avatar !== null) {
				$("#play").show();
			}
		},
		
		/* startGame function:
			- function to start and restart the game
			- model data gets setup via M.start()
			- view gets started and hides ttt-options or ttt-result and displays
				ttt-game
			-	when ttt-game is displayed, C.nextMove handles whose move it is */
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
		
		/* handleHumanMove function:
			- handles human's move, called via event listener
			- event listeners get removed in view
			- Model data gets updated
			- View displays move
			- check for game end
			- if game is over, call endGame function
			- if game is not over, prepare computer's move */
		handleHumanMove: function(move) {
			myTTT.V.suspendHumanAction(myTTT.M.emptyCells);
			myTTT.M.currentState[move] = myTTT.M.human.avatar;
			myTTT.M.emptyCells.splice($.inArray(move, myTTT.M.emptyCells), 1);
			myTTT.V.showMove("human", move);
			var rslt = myTTT.M.isGameOver();
			if (rslt.gameOver === false) {
				myTTT.M.turn = "computer";
				myTTT.V.updateTurn(myTTT.M.turn);
				window.setTimeout(function() {
					myTTT.C.nextMove();
			}, 800);
			}
			else {
				console.log("game over");
				this.endGame(rslt);
			}
		},
		
		/* handleComputerMove function:
			- behaves similiar to handleUserMove function, except for the
				event listener handling
			- gets called from myTTT.M.computer.next*Move function */
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
		
		/* endGame function:
			- view handles it all, shows result and #ttt-result
			- changing options and restarting is handled via myTTT.C.startGame() */
		endGame: function(rslt) {
			myTTT.V.endGame(rslt);
		}

	}; // end myTTT.C