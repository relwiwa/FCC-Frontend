$(document).ready(function() {

	var myCalc = {};
	myCalc.currentCalc = "";
	myCalc.trimmedCalc = "";
	myCalc.currentArg = "";
	myCalc.currentResult;
	myCalc.operators = "+-/%*";
	myCalc.prevCalc = [];
	myCalc.resulted = false;

	/* Update of myCalc.currentCalc and extra myCalc.currentArg after digit was entered
		 A separate myCalc.currentArg is used to ensure no two dots or zeros at the beginning of one argument,
		 it is easier doing this when argument is stored separately */
	myCalc.updtArg = function(value) {
		myCalc.currentArg += value;
		myCalc.currentCalc += value;
		myCalc.updtDsply();
		myCalc.updtRslt();
	}

	/* Called, after an operator was entered.
		 - myCalc.currentArg is being reset
		 - myCalc.currentCalc is being updated */
	myCalc.updtCalc = function(value) {
		myCalc.currentArg = "";
		myCalc.currentCalc += value;
		myCalc.updtDsply();
		myCalc.updtRslt();
	}

	/* Calculates and updates myCalc.currentResult.
		 It gets rid of useless operators at the end and stores this calculation in myCalc.trimmedCalc, keeping the operator in myCalc.currentCalc
		 It also replaces to minus by a plus operator, as -- is another operator in JS */   
	myCalc.updtRslt = function() {
		myCalc.trimmedCalc = myCalc.currentCalc.substr(0, (myCalc.currentCalc.length - myCalc.chkOps(myCalc.currentCalc)));
		myCalc.trimmedCalc = myCalc.trimmedCalc.replace("--", "+");
		myCalc.currentResult = eval(myCalc.trimmedCalc);
		// cutting decimals to 2 digits
		/*  if (myCalc.currentResult.toString().indexOf(".") >= 0) {
			myCalc.currentResult = myCalc.currentResult.toFixed(2);
		} */
	}

	/* Updates content in calculator display.
		 - No argument: puts myCalc.currentCalc in display
		 - Argument: argument gets displayed */
	myCalc.updtDsply = function() {
		if (arguments[0]) {
			$("#display").val(arguments[0]); 
		} else {
			$("#display").val(myCalc.currentCalc);
		}
	}

	/* Determines, whether at the end of item there is no, one or two operators */
	myCalc.chkOps = function(item) {
		var result = 0;
		if (myCalc.operators.indexOf(item[item.length - 1]) >= 0) {
			result++;
			if (result === 1 && myCalc.operators.indexOf(item[item.length - 2]) >= 0) {
				result++
			}
		}
		return result;
	}

	/* Uses myCalc.resulted to check if result is currently displayed.
		 myCalc.resulted is set to true by result button function.
		 It ensures that
		 - result is kept if an operator or delete button is hit next
		 - result is reset if a digit or dot is typed. */
	myCalc.chkRsltd = function(keepOrReset) {
		if (myCalc.resulted === true) {
			if (keepOrReset === "reset") {
				myCalc.currentArg = "";
				myCalc.currentCalc = "";
				myCalc.resulted = false;
			} else {
				myCalc.resulted = false;
			}
		}
	}

	/*****************************************************************
	/ Implementation of different calculator buttons:
	/   - numbers, including zero button
	/   - dot button
	/   - operators, with minus button being implemented separately
	/   - clear button
	/   - result button
	/   - delete button 
	/****************************************************************/

	/* Number buttons including zero:
		 Ensures that there is/there are no zero/s as first digit of each argument, except for decimals.
		 This also is true when a zero is entered, but not followed by a decimal dot */
	$(".digit").on("click", function() {
		console.log("ab");
		myCalc.chkRsltd("reset");
		if (($(this).text() === "0")) {
			if (!(myCalc.currentArg === "0")) {
				myCalc.updtArg($(this).text());      
			}  
		} else {
			if (myCalc.currentArg === "0") {
				myCalc.currentArg = myCalc.currentArg.substr(0, myCalc.currentArg.length - 1);
				myCalc.currentCalc = myCalc.currentCalc.substr(0, myCalc.currentCalc.length - 1);
				myCalc.updtArg($(this).text());
			} else {
				myCalc.updtArg($(this).text());
			}
		}
	});

	/* dot button:
		 Ensures three things:
		 - There's no two dots in one argument.
		 - There's a zero added in front of a dot as first digit.
		 - There's a zero added between minus and dot at the start */
	$(".dot").on("click", function() {
		myCalc.chkRsltd("reset");
		if (myCalc.currentArg.indexOf(".") < 0) {
			if (myCalc.currentArg === "" || myCalc.currentArg === "-") {
				myCalc.updtArg("0.");
			} else {
				myCalc.updtArg(".");
			}
		}
	});

	/* Minus button:
		 Handling the fact that minus can indicate minus operator or negative numbers.
		 We have to ensure:
		 - No two minus at the start of a calculation.
		 - Not more than one operator before a minus in the middle of a calculation. */
	$(".minus").on("click", function() {
		myCalc.chkRsltd("keep");
		if (myCalc.currentCalc === "") {
			myCalc.updtArg("-");
		} else {
			// There's no operator as the last digit, so minus can be added
			if (!(myCalc.operators.indexOf(myCalc.currentCalc[myCalc.currentCalc.length - 1]) >= 0)) {
				myCalc.updtCalc("-");
			} else {
				// There's an operator as the last digit, but no two operators as last digits, so minus can be added as part of next argument
				if ((!(myCalc.operators.indexOf(myCalc.currentCalc[myCalc.currentCalc.length - 2]) >= 0)) && myCalc.currentCalc.length > 1) {
					myCalc.updtArg("-");
				}
				// When there's already two operators, the last one is already minus, so no need to do anything else
			}
		}
	});

	/* Operator buttons except minus:
		 We ensure that:
		 - There's no operator button at the start of a calculation
		 - There's never two operators following each other */
	$(".operator").on("click", function() {
		myCalc.chkRsltd("keep");
		if ((myCalc.currentCalc !== "") && (myCalc.currentCalc !== "-")) {
			// Checking for operator at last digit
			if (myCalc.operators.indexOf(myCalc.currentCalc[myCalc.currentCalc.length - 1]) >= 0) {
				// no two operators as last digits, so operator can be replaced
				if (!(myCalc.operators.indexOf(myCalc.currentCalc[myCalc.currentCalc.length - 2]) >= 0)) {
					myCalc.currentCalc = myCalc.currentCalc.substring(0, myCalc.currentCalc.length - 1) + $(this).text();
					myCalc.updtDsply();
				}
				// two operators as last digits, so ignore input as the second operator can only be minus
			} else {
				// there's no operators at all as last digit, so add the operator.
				myCalc.updtCalc($(this).text());
			}
		}
	});

	/* Clear button.
		 Delete current calculation, argument and update display. */
	$(".clear").on("click", function() {
		myCalc.chkRsltd("reset");
		myCalc.currentArg = "";
		myCalc.currentCalc = "";
		myCalc.trimmedCalc = "";
		myCalc.currentResult = "";
		myCalc.updtDsply();
	});

	/* Result button:
		 Displays result, and ensures that possible operator at the end gets deleted.
		 Puts result into currentArg and currentCalc properties.
		 If an illegal operation with result Infinity or NaN takes places, animation starts, no calculation is being displayed
		 Calculation gets added to myCalc.previousCalc and displayed in calculation history */
	$(".result").on("click", function() {
		myCalc.updtRslt();
	//  myCalc.addHstry();
		if (myCalc.currentResult === Infinity || myCalc.currentResult === -Infinity || isNaN(myCalc.currentResult)) {
			$("#calculator").addClass("animated shake");
			window.setTimeout(function() {
				$("#calculator").removeClass("animated shake");
			}, 2000);
		} else {
			myCalc.currentArg = myCalc.currentResult.toString();
			myCalc.currentCalc = myCalc.currentResult.toString();
			myCalc.resulted = true;
			myCalc.updtDsply();
		}
	});

	/* Delete button.
		 When there is input, myCalc.currentCalc and/or myCalc.currentArg get shortened by one digit, ensuring:
		 - myCalc.currentArg is always properly reset after deleting an operator
		 - mycalc.currentResult and calculator's display get updated. */
	$(".delete").on("click", function() {
		myCalc.chkRsltd("keep");
		if (myCalc.currentArg !== "") {
			myCalc.currentArg = myCalc.currentArg.substr(0, (myCalc.currentArg.length - 1));
			myCalc.currentCalc = myCalc.currentCalc.substr(0, (myCalc.currentCalc.length - 1));
		}
		else {
			if (myCalc.currentCalc !== "") {
				// 1. remove operator
				myCalc.currentCalc = myCalc.currentCalc.substr(0, (myCalc.currentCalc.length - 1));
				// 2. get remaining operators
				var rmngOps = [];
				for (var i = 0; i < myCalc.operators.length; i++) {
					rmngOps.push(myCalc.currentCalc.lastIndexOf(myCalc.operators[i]));
				}
				rmngOps.sort(function(a, b) {
					return a - b;
				}); 
				var lstRmngOp = rmngOps.pop();
				// 3. check, whether there is only one argument left, positive or negative number
				if (lstRmngOp === -1 || lstRmngOp === 0) {
					myCalc.currentArg = myCalc.currentCalc;
				}
				// 4. There are still more than just one argument, so update currentArg, distinguishing positive and negative numbers
				else { 
					// 4.a Negative number as there are two operators
					if (myCalc.operators.indexOf(myCalc.currentCalc.substr(lstRmngOp -1, 1)) >= 0) {
						myCalc.currentArg = myCalc.currentCalc.substr(lstRmngOp);
					}
					// 4.b Positive number as there is only one operator
					else {
						myCalc.currentArg = myCalc.currentCalc.substr(lstRmngOp + 1);
					}
				} 
			} // else-case: there are no more digits
		}
		myCalc.updtDsply();
		myCalc.updtRslt();

	});
	
});