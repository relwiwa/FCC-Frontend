/****************************************************
	LOCATION SERVICE
	---------------------------------------------------
	handles automatic geolocation functionality
	---------------------------------------------------
	- Singleton pattern is used for inner properties
		supported and position
****************************************************/
angular.module("localWeather").service("locationSvc", ["$q", function($q) {
	var self = this;
	
	self.geoLocation = (function() {
		var supported;
		var position;
		
		function checkSupport() {
			if (navigator.geolocation) {
				return true;
			}
			else {
				return false;
			}
		};

		function setPosition() {
			return $q(function(resolve, reject) {
				if (!position) {
					navigator.geolocation.getCurrentPosition(
						function(result) {
							position = result;
							resolve(position);
						},
						function(error) {
							reject(error);
						}
					);
				}
				else {
					resolve(position);
				}
			});
		};
		
		return {
			isSupported: function() {
				if (!supported) {
					supported = checkSupport();
				}
				return supported;
			},
			
			getPosition: function() {
				return $q(function(resolve, reject) {
					if (!position) {
						setPosition().then(
							function(result) {
								resolve(result);
							},
							function(error) {
								reject(error);
							}
			      );
					}
					else {
						resolve(position);
					}
				});
			}
			
		};
	
	})();
	
}]);

/****************************************************
	FORECAST SERVICE
	---------------------------------------------------
	- handles queries to wunderground's api
	- api key needs to be entered
	---------------------------------------------------
	- getCurrentConditions returns current conditions
		for the city/coords/zwm-id entered
****************************************************/
angular.module("localWeather").service("forecastSvc", ["$q", "$http", function($q, $http) {

	var self = this;
	var key = ""; // enter your API key here

	self.getCurrentConditions = function(input) {
		// query via coordinates
		if (input.coords) {
			return $q(function(resolve, reject) {
				$http.get("http://api.wunderground.com/api/" + key + "/conditions/lang:EN/q/" + input.coords.latitude + "," + input.coords.longitude + ".json").then(
					function(result) {
						// TODO: test for result.data.current_observation could be put here instead of putting it into controller
						resolve(result);
					},
					function(error) {
						reject(error);
					}
				);
			});
		}
		// query via manual input, zwm-id or autoip feature
		else {
			return $q(function(resolve, reject) {
				$http.get("http://api.wunderground.com/api/" + key + "/conditions/lang:EN/q/" + input + ".json").then(
					// TODO: test for result.data.current_observation could be put here instead of putting it into controller
					function(result) {
						resolve(result);
					},
					function(error) {
						reject(error);
					}
				);
			});
			
		}
	};
	
}]);