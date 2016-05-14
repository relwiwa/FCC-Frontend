/********************************************************
	CURRENTCONDITIONS CONTROLLER
	-------------------------------------------------------
	responsible for managing local weather conditions
	- tries to automatically get user's location via
		geolocation
	- if geolocation is not available or does not work,
		uses autoip feature of wunderground api
	- if autoip does not work either, prompts user to
		enter location manually
	- manual search is possible all the time
	- queries to wunderground api are placed in forecastSvc
	- in the view, messages are displayed depending on
		various data being present or set to true/false
	- controller as-syntax is used as well as vm = this
		so that this can be properly addressed within
		functions
********************************************************/

angular.module("localWeather").controller("CurrentConditionsCtrl", ["locationSvc", "forecastSvc", function(locationSvc, forecastSvc) {
	var vm = this;

	// current conditions data is stored here
	vm.current = {
		position: {},
		conditions: {}
	};
	
	vm.automaticSupport = true;
	vm.tempScale = "C"
	
	// data for handling manual search
	vm.manual = {
		userInput: "",
		notFound: false,
		ongoingQuery: false
	}
	
	/* automaticQuery function
		- tries to get user's location via geolocation or autoip feature of
			weather underground api; geolocation is more accurate, so we try to
			get user's location with this one first
		- if user's geolocation is retrieved, gets current weather conditions
			via forecastSvc.getCurrentConditions and overwriting current object, thus updating view; if request for weather data based on geolocation isn't
			successful, autoip feature is used
		- if geolocation is not supported, autoip feature of weather
			underground api is used instead
		- query with autoip feature is put into vm.autoIpQuery function
		- if neither geolocation nor autoip workout, vm.geoLocSupport is
			set to false, prompting user in view to manually enter location */
	vm.automaticQuery = function() {
		locationSvc.geoLocation.getPosition().then(
			// grabbing location via geolocation was successful
			function(result) {
				vm.current.position.coords = result.coords;
				forecastSvc.getCurrentConditions().viaCoords(vm.current.position).then(
					// request for weather data was successful
					function(result) {
						vm.current = result;
					},
					// request for weather data wasn't successful, now try autoip feature
					function() {
						vm.autoIpQuery();
					}
				)
			},
			// grabbing location via geolocation was not successful, so use autoip feature of weather underground api
			function() {
				vm.autoIpQuery();
			}
		); 
	};
	
	/* autoIpQuery function:
		- uses weather underground api's autoip feature
		- gets called either when geolocation is disabled or request for
			weather data based on geolocation wasn't successful
		-	if autoip request for weather data is also not successful,
			vm.automaticSupport gets set to false;
	*/
	vm.autoIpQuery = function() {
		forecastSvc.getCurrentConditions().viaAutoIp().then(
			function(result) {
				vm.current = result;
			},
			// request for weather data based on autoip feature wasn't succesful, so prompt user to manually enter location
			function() {
				vm.automaticSupport = false;
			}
		);
	}
	
	/* manualQuery Function
		- enable user to manually enter a location and tries to fetch
			conditions for the location entered
		- serveral properties are used to correctly display messages in view:
			--- vm.manual.ongoingQuery is true whenever a manual search is happening
			--- vm.manual.notFound is true when weather data for location was not found */
	vm.manualQuery = function() {
		// set/reset data for proper display of messages in view
		vm.manual.notFound = false;
		vm.manual.ongoingQuery = true;
		vm.current = {};

		forecastSvc.getCurrentConditions().viaUserInput(vm.manual.userInput).then(
			/* request for weather data was successful, so:
				- set current
				- reset manual */
			function(result) {
				vm.current = result;
				vm.manual.userInput = "";
				vm.manual.ongoingQuery = false;
			},
			/* request for weather data wasn't successful, so:
				- set manual.notFound
				- reset current, manual.userInput, manual.ongoingQuery */
			function(error) {
				console.log("error");
				vm.manual.userInput = "";
				vm.manual.ongoingQuery = false;
				vm.manual.notFound = true;
				vm.current = {};
			}
		);			
	};
	
	vm.automaticQuery();
	
}]);