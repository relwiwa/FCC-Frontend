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
	
	
	  /************************************************
	    getCurrentConditions function
		-------------------------------------------------
		- returns conditions data from wunderground api
		- can handle different types of requests:
		--- coordinates
		--- autoip
		--- user text input
		- internal executeQuery function fetches data
			from api; it operates recursively if request
			ended up in a not unique location
		- if successful, a proper response object is
			built in internal buildResponse function
		*************************************************/
	self.getCurrentConditions = function() {

		/* INTERNAL FUNCTIONALITY */
		
		/* buildResponse function
		   - expects a proper conditions object from weather underground api, ie.
			 	 data.current_observation is already stripped away
			 - returns object with current conditions */
		function buildResponse(input) {

			var output = {};

			// store all information in conditions
			output.conditions = input;
			
			// shortcuts for relevant pieces of information
			output.place = output.conditions.display_location.full;
			output.temperatureC = output.conditions.temp_c;
			output.temperatureF = output.conditions.temp_f;
			output.description = output.conditions.weather;
			output.icon = output.conditions.icon_url;

			return output;
		};
		
		/* executeQuery function
			- executes query to weather underground api
			- handles various responses:
			--- successful request returning proper weather data for location entered
			--- initializes another request if location entered did not result in
					unique location;
					Please note:
					the first location in data.response.results is used, so we leave it
					to users to change location manually if that wasn't the one they were looking for
			--- rejects if location entered did not match any location within weather
					underground api */
		function executeQuery(query) {
			
			return $q(function(resolve, reject) {
				
				$http.get("http://api.wunderground.com/api/" + key + "/conditions/lang:EN/q/" + query + ".json").then(
					
					// api request worked without error
					function(result) {
						// query was successful and returned weather data
						if (result.data.current_observation) {
							resolve(buildResponse(result.data.current_observation));
						}
						// query did not return weather data
						else {
							// query matched several locations, so use first zmw code and call executeQuery recursively
							if (result.data.response.results) {
								resolve(executeQuery("zmw:" + result.data.response.results[0].zmw));
							}
							// query matched no location at all
							else {
								reject();
							}
						}
					},
					
					// error happened during get request
					function(error) {
						reject(error);
					}
				);
			});
		};
		
		/* EXTERNALLY ACCESSIBLE FUNCTIONALITY */
		
		return {

			// query via coordinates
			viaCoords: function(input) {
				return (executeQuery(input.coords.latitude + "," + input.coords.longitude));
			},

			// query using weather undergrounds autoip feature
			viaAutoIp: function() {
				return (executeQuery("autoip"));
			},
			
			// query via manual input, zwm-id or autoip feature
			viaUserInput: function(input) {
				return (executeQuery(input));
			}
			
		}
	}; // /self.getCurrentConditions
	
}]);