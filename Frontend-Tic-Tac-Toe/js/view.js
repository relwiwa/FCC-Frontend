	/****************************************************
		VIEW myTTT.V
		---------------------------------------------------
	 ***************************************************/	

	if (!myTTT) {
		var myTTT = {};	
	}

	myTTT.V = {
		
		/* <i>-fragments of font awesome avatars are stored here for usage in view */
		human: {
			avatarHTML: null
		},
		
		computer: {
			avatarHTML: null
		},
		
		/* setupOptions function:
			- adds event listeners to ttt-options and play button */
		setupOptions: function() {
			$("#choose-difficulty button").click(function() {
				$("#choose-difficulty button").removeClass("btn-active").addClass("btn-default");
				$(this).removeClass("btn-default").addClass("btn-active");
				$("#difficulty").text($(this).text());
				myTTT.C.updateDifficulty(this);
			});
			
			$("#choose-avatar button").click(function() {
				console.log("updating avatars");
				$("#choose-avatar button").removeClass("btn-active").addClass("btn-default");
				$(this).removeClass("btn-default").addClass("btn-active");
				$("#human").html($(this).html());
				$("#computer").html($("#choose-avatar button.btn-default").html());
				myTTT.C.updateAvatars(this, $("#choose-avatar button.btn-default"));
			});
			
			/* when clicking one of the play, play-again or change-options
				 buttons, we immediately use .off to remove the event listener in
				 order to prevent multiple calls to startGame, etc. */
			$("#play").click(function() {
				$("#play").off();
				myTTT.C.startGame();
			});
		},
	
		/* start function:
			- updates view for starting the game
			- works for restarting the game, too
			- takes different visibility state of three main elements into account */
		start: function(turn) {
			var self = this;
			self.updateTurn(turn);
			var d = $.Deferred(function() {
				if ($("#ttt-options").is(":visible")) {
					self.hideOrShow("#ttt-options", "hide").then(function() {
						self.setupCells();
						self.hideOrShow("#ttt-game", "show").then(function() {
							d.resolve();
						});
					});
				}
				else if ($("#ttt-result").is(":visible")) {
					self.setupCells();
					self.hideOrShow("#ttt-result", "hide").then(function() {
						d.resolve();
					});
				}
			});
			return d.promise();
		},
		
		/* hideOrShow function:
			- helper function for fading an element in or out
			- returns promise that is resolved when animation is done */ 
		hideOrShow: function(element, hideOrShow) {
			var d = $.Deferred(function() {
				if (hideOrShow === "hide") {
					$(element).fadeOut(600).promise().then(function() {
						d.resolve();
					});
				}
				else {
					$(element).fadeIn(600).promise().then(function() {
						d.resolve();
					});
				}
			});
			return d.promise();
		},
		
		/* setupCells function:
			- helper function to create the cells anew
			- used by start function */
		setupCells: function() {
			var cells = "";
			for (var i = 0; i < 3; i++) {
				cells += "<div class='row'>";
				for (var j = 0; j < 3; j++) {
					cells += "<div class='x-o col col-xs-4'><div><span></span></div></div>";
				}
				cells += "</div>";
			}
			$("#ttt-field").html(cells);
		},
		
		/* setupHumanMove function:
			- when it's human's turn, add event listeners to available cells
			- expects array with empty cell numbers */		
		setupHumanMove: function(emptyCells) {
			var cells = $(".x-o");
			console.log(emptyCells);
			for (var i = 0; i < emptyCells.length; i++) {
				// IIFE to make i available via closure
				(function(el) {
					cells.eq(emptyCells[i]).click(function() {
						myTTT.C.handleHumanMove(el);
					});
				})(emptyCells[i]);
			}
		},
		
		/* suspendHumanAction function:
			- after each human turn, the event listeners are taken off from the cells */
		suspendHumanAction: function(emptyCells) {
			var cells = $(".x-o");
			for (var i = 0; i < emptyCells.length; i++) {
				cells.eq(emptyCells[i]).off();
			}
		},
		
		/* updateTurn function:
			- toggles active state of human's and computer's  avatar, depending
				on turn */
		updateTurn: function(turn) {
			$("#computer").removeClass("text-primary");
			$("#human").removeClass("text-primary");
			$("#" + turn).addClass("text-primary");
		},
		
		/* showMove function:
			- displays the move described by the variables actor and move */
		showMove: function(actor, move) {
			$(".x-o div span").eq(move).html(this[actor].avatarHTML);
		},
		
		/* endGame function:
			- if there is a winner, highlights the three winning cells
			- updates ttt-result's text and class depending on match result
			- handles event handlers for play, play-again and change-options
				buttons
			- fades in ttt-result */
		endGame: function(rslt) {
			
			$("#play-again").click(function() {
				$("#play-again").off();
				$("#change-options").off();
				myTTT.C.startGame();
			});

			$("#change-options").click(function() {
				$("#change-options").off();
				$("#play-again").off();
				myTTT.V.hideOrShow("#ttt-result", "hide");
				myTTT.V.hideOrShow("#ttt-game", "hide").then(function() {
					myTTT.V.hideOrShow("#ttt-options", "show").then(function() {
						$("#play").click(function() {
							$("#play").off();
							myTTT.C.startGame();
						});
					});
				});
			});
				
			if (rslt.winner === "tie") {
				$("#ttt-result div").removeClass("alert-info alert-warning alert-danger").addClass("alert-warning").children("#result").text("It's a tie!");
			}
			else {
				var divs = $(".x-o");
				for (var i = 0; i < rslt.cells.length; i++) {
					divs.eq(rslt.cells[i]).addClass("text-primary");
				}
				if (rslt.winner === "computer") {
					$("#ttt-result div").removeClass("alert-info alert-warning alert-danger").addClass("alert-danger").children("#result").text("You lost!");
				}
				else {
					$("#ttt-result div").removeClass("alert-info alert-warning alert-danger").addClass("alert-info").children("#result").text("You won!");
				}
			}
			$("#ttt-result").fadeIn();
		}

	} // end myTTT.V