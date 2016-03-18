/*****************************************************************
  POMODORO CLOCK by Walter for FreeCodeCamp Frontend Certification
*****************************************************************/

var myClock = angular.module("myClock", []);
   
myClock.controller("ClockController", ["$scope", "$interval", function ($scope, $interval) {
	
  // Application Variables
  $scope.mode = "sess"; // sess || brk
  $scope.currInterval;
  $scope.started = false;
  $scope.paused = false;
	$scope.transformSupport;
  
  // Session-Object
  $scope.sess = {};
  $scope.sess.standard = 25;
  $scope.sess.duration = $scope.sess.standard;
  $scope.sess.elapsed = 0;
  $scope.sess.remaining = $scope.sess.duration * 60 - $scope.sess.elapsed;
  $scope.sess.minutes = $scope.sess.remaining / 60;
  $scope.sess.seconds = $scope.sess.remaining % 60;

  // Break-Object
  $scope.brk = {};
  $scope.brk.standard = 5;
  $scope.brk.duration = $scope.brk.standard;
  $scope.brk.elapsed = 0;
  $scope.brk.remaining = $scope.brk.duration * 60 - $scope.brk.elapsed;
  $scope.brk.minutes = $scope.brk.remaining / 60;
  $scope.brk.seconds = $scope.brk.remaining % 60;
	
 /************************************************************************
    INDIVIDUAL WATCH FUNCTIONS FOR DATA BINDING
  *************************************************************************
    - both watch-functions for sess and brk are identical, they could be
      combined into one function or a service
    - two variables are being watched, and when changes occur, updates
      take place:
      - sess.duration:
        - it changes, when session duration is increased or decreased
          by user
        - sess.remaining, and sess.minutes need to be updated
      - sess.elapsed:
        - it changes at every interval
        - sess.remaining and sess.seconds get updated each time
        - sess.minutes gets updated when there's a switch from :00 to :59,
          ie. sess.elapsed % 60 === 1
        - switch to break mode takes place, when 0:00 is reached
        - mode is changed to brk, interval gets canceled, start function
          gets called in brk mode
  ************************************************************************/  
  
  /* watching sess.duration:
     when it changes, automatically update:
     - remaining time
     - minutes
		 - pointer */
  $scope.$watch("sess.duration", function () {
    $scope.sess.remaining = $scope.sess.duration * 60 - $scope.sess.elapsed;
    $scope.sess.minutes = Math.floor($scope.sess.remaining / 60);
		if ($scope.mode === "sess") {
			$scope.updatePointer();
		}
  });

  /* watching sess.elapsed:
     - sess.elapsed changes after each interval,
     - sess.remaining, sess.minutes and sess.seconds and sess.pointer get updated automatically
     - minutes decrease by 1 every time when there is one second elapsed, ie. switching from :00 to :59
     - at 0:00, session-interval is stopped, and switch to break-interval takes place:
       - mode becomes brk
       - body-class gets changed manually, due to codepen restricting ability to add classes
         to body element; otherwise it would be possible to add class={{mode}} to body-tag */
  $scope.$watch("sess.elapsed", function () {
    $scope.sess.remaining = $scope.sess.duration * 60 - $scope.sess.elapsed;
    if ($scope.sess.elapsed % 60 === 1) {
      if ($scope.sess.minutes > 0) {
        $scope.sess.minutes--;
      } else {
        $scope.mode = "brk";
        document.body.className = "brk";
        $interval.cancel($scope.currInterval);
        $scope.start();
        console.log("breaktime");
      }
    } 
			$scope.updatePointer();
			$scope.sess.seconds = $scope.sess.remaining % 60;
  });

  /* watching brk.duration:
     same as watching sess.duration */
  $scope.$watch("brk.duration", function () {
    $scope.brk.remaining = $scope.brk.duration * 60 - $scope.brk.elapsed;
    $scope.brk.minutes = Math.floor($scope.brk.remaining / 60);
		if ($scope.mode === "brk") {
			$scope.updatePointer();
		}
  });

  /* watching brk.elapsed:
     same as watching sess.elapsed */
  $scope.$watch("brk.elapsed", function () {
    $scope.brk.remaining = $scope.brk.duration * 60 - $scope.brk.elapsed;
    if ($scope.brk.elapsed % 60 === 1) {
      if ($scope.brk.minutes > 0) {
        $scope.brk.minutes--;
      } else {
        $scope.mode = "sess";
        document.body.className = "sess";
        $interval.cancel($scope.currInterval);
        $scope.start();
        console.log("sessiontime");
      }
    }
    $scope.brk.seconds = $scope.brk.remaining % 60;
		$scope.updatePointer();
  });  
  
  /************************************************************************
    FUNCTIONS TO CONTROL THE POMODORO CLOCK
  *************************************************************************
    regardless of current mode (session or break), the following functions
    should work universally in both modes, usually depending on $scope.mode
  ************************************************************************/

 /* changeDuration function
    - updates the duration of session or break
    - if there's less than a minute left, no more decreasing is possible
    - changes can be made all the time, regardless of session or breaks
      having been started, paused or not started yet */
 $scope.changeDuration = function(operation, sessionOrBreak) {
    if (operation === "+") {
      $scope[sessionOrBreak].duration++;
    }
    if (operation === "-" && $scope[sessionOrBreak].duration * 60 - 60 > $scope[sessionOrBreak].elapsed) {
      $scope[sessionOrBreak].duration--;
    }
  };
	
	/* updatePointer function
		 - updates pointer variable which is binded to #pointer
		 - in sess-mode direction is forward
		 - in brk-mode direction is backward
		 - gets called by both of sess and brk's watch-functions */
	$scope.updatePointer = function() {
		if ($scope.mode === "sess") {
			document.getElementById("container").style[$scope.transformSupport] = "rotate(" + (($scope.sess.elapsed * 360) / ($scope.sess.duration * 60)) + "deg)";
		}
		else {
			document.getElementById("container").style[$scope.transformSupport] = "rotate(" + (($scope.brk.elapsed * -360) / ($scope.brk.duration * 60)) + "deg)";
		}
	}

  /* universal start function
     - works for starting both sess- and brk-time, based on $scope.mode
     - new interval is created (the old one gets canceled in the respective watch section)
     - started is set to true
		 - audio file is played at the beginning and when switching between modes:
		   as audio file playback is now linked to user clicking the start button in order
			 to start the clock, audio playback now also works on mobile devices (where playback
			 without user interaction is restricted). As it's just a regular gong sound,
			 ignoring these restrictions seems justified for the benefit of a better user
			 experience.
     - elapsed and minutes are being reset, no need to reset seconds or duration */
  $scope.start = function () {
    $scope.started = true;
    $scope["sess"].elapsed = 0;
		$scope["brk"].elapsed = 0;
		document.getElementById("audio").play();
    $scope[$scope.mode].minutes = $scope[$scope.mode].duration;
    $scope.currInterval = $interval(function () {
      $scope[$scope.mode].elapsed++;
    }, 1000);
  };

  /* pause function:
     - works for pausing both sess- and brk-time
     - current interval gets cancelled (will be started new by advance function)
     - paused is set to true */
  $scope.pause = function () {
    $scope.paused = true;
    $interval.cancel($scope.currInterval);
  };
  
  /* advance function:
     - works for continuing either sess- or brk-time
     - a new interval is started, based on current mode
     - paused gets set to false */
  $scope.advance = function () {
    $scope.paused = false;
    $scope.currInterval = $interval(function () {
      $scope[$scope.mode].elapsed++;
    }, 1000);  
  };
  
  /* reset-function
     - current interval is stopped
     - sess- and brk-variables get reset to default values
     - switching to sess-mode and updating body class
     - started and stopped are set to false */
  $scope.reset = function () {
    $scope.started = false;
    $scope.paused = false;
    $interval.cancel($scope.currInterval);
    $scope.sess.duration = $scope.sess.standard;
    $scope.sess.elapsed = 0;
    $scope.sess.minutes = $scope.sess.duration;
    $scope.brk.duration = $scope.brk.standard;
    $scope.brk.elapsed = 0;
    $scope.brk.minutes = $scope.brk.duration;
    $scope.mode = "sess";
    document.body.className = "sess";
  };
	
  /************************************************************************
    CROSS-BROWSER OPTIMIZATION
  *************************************************************************
    cross-croswer problematic parts are:
		- pointer relies on transform property
  ************************************************************************/
		
	/* handleTransformSupport function
			 - tests support of transform property
			 - sets transformSupport variable to regular or respective vendor prefixed property 
			 - if no support is available:
			   - pointer is hidden
				 - updatePointer function gets overwritten with empty function
			 - as testing for style properties with style[property]-syntax is not fully
			   supported by all browsers, the testing for each vendor is hardcoded */
	$scope.handleTransformSupport = function () {
		var div = document.createElement("div");
		if (div.style.transform !== undefined) { $scope.transformSupport = "transform"; }
		if (div.style.msTransform !== undefined) { $scope.transformSupport = "msTransform"; }
		if (div.style.MozTransform !== undefined) { $scope.transformSupport = "MozTransform"; }
		if (div.style.OTransform !== undefined) { $scope.transformSupport = "OTransform"; }
		if (div.style.webkitTransform !== undefined) { $scope.transformSupport = "webkitTransform"; }
		if (div.style.WebkitTransform !== undefined) { $scope.transformSupport = "WebkitTransform"; }
		if ($scope.transformSupport === "") {
			document.getElementById("pointer").style.display = "none";
			$scope.updatePointer = function () {};
		}
	}
	
	$scope.handleTransformSupport();
  document.body.className = "sess";


}]);