/* FORECAST SERVICE
   handles forecasts for positions */
angular.module("localWeather").service("forecastSvc", ["$q", "$http", function($q, $http) {

	var self = this;
	var key = ""; // enter your API key here

	self.getCurrentForecast = function(input) {
		return $q(function(resolve, reject) {
			$http.get("http://api.wunderground.com/api/" + key + "/conditions/lang:EN/q/" + input.coords.latitude + "," + input.coords.longitude + ".json").then(
				function(result) {
					resolve(result);
				},
				function(error) {
					reject(error);
				}
			);
		});
	};
	
}]);


/* LOCATION SERVICE */
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