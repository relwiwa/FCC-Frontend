/*********************************************************
  LOCAL WEATHER APP
	--------------------------------------------------------
	FreeCodeCamp's Frontend Certification
	--------------------------------------------------------
	Fulfills the required user stories:
	1. I can see the weather in my current location.
	2. I can see a different icon or background image (e.g.
		 snowy mountain, hot desert) depending on the weather.
	3. I can push a button to toggle between Fahrenheit and
		 Celsius.
	--------------------------------------------------------
	Adds extra functionality:
	- Manual search is possible
	- Can be extended to display more details or forecast
	--------------------------------------------------------
	Weather Underground's API:
	- it is used as it has proper	support of timezones
	- only works when entering API key in forecastSbc
*********************************************************/

angular.module("localWeather", ["ngRoute"]);

/* Routing 
 	- not relevant at the moment
	- relevant when adding further functionality or
		when using route parameters */
angular.module("localWeather").config(["$routeProvider", function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "partials/current.html",
	})
	.otherwise({
		redirectTo: "/"
	})
}]);