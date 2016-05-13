/***************************************
  LOCAL WEATHER APP
	-------------------------------------
	FreeCodeCamp's Frontend Certification
	-------------------------------------
**************************************/

angular.module("localWeather", ["ngRoute"]);

/* Routing */

angular.module("localWeather").config(["$routeProvider", function($routeProvider) {
	$routeProvider
	.when("/", {
		templateUrl: "partials/current.html",
	})
	.otherwise({
		redirectTo: "/"
	})
}]);