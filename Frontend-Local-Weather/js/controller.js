/********************************************************
	CURRENTCONDITIONS CONTROLLER
	-------------------------------------------------------
	Responsible for getting local weather conditions
	- uses to functions for automatic and manual lookup
		of location, before fetching current conditions
	- tries to automatically get user's location via
		geolocation
	- if geolocation is not available, prompts user to
		enter location manually
	- manual search is possible all the time
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
		conditions: {},
		tempScale: "C"
	};
	
	vm.geoLocSupport = true;
	
	// data for handling manual search
	vm.manual = {
		userInput: "",
		apiOutput: "",
		notFound: false,
		ongoingQuery: false
	}
	
	/* automaticQuery Function
		- tries to get user's location via geolocation using locationSvc
		- if user's location is retrieved, gets current weather conditions
			via forecastSvc.getCurrentConditions and puts results into
			vm.current.xxx, thus updating view
		- if no user-data is retrieved, sets vm.geoLocSupport to false,
			prompting user in view to manually enter location */
	vm.automaticQuery = function() {
		locationSvc.geoLocation.getPosition().then(function(result) {
			vm.current.position.coords = result.coords;
			forecastSvc.getCurrentConditions(vm.current.position).then(
				function(result) {
					vm.current.conditions = result;
					vm.current.place = vm.current.conditions.data.current_observation.display_location.full;
					vm.current.temperatureC = vm.current.conditions.data.current_observation.temp_c;
					vm.current.temperatureF = vm.current.conditions.data.current_observation.temp_f;
					vm.current.weather = vm.current.conditions.data.current_observation.weather;
					vm.current.icon = vm.current.conditions.data.current_observation.icon_url;
				}
			)
		},
    function(error) {
			vm.geoLocSupport = false;
		}); 
	};
	
	/* manualQuery Function
		- enable user to manually enter a location and tries to fetch
			conditions for the location entered
		- depends on presence of certain properties in result object
			for determing success, partial success or failure of request
			for weather data
		- if data.current_observation is available, location entered is
			unique and weather conditions can be put to vm.current.xxx
		- if data.current_observation doesn't exist, but data.response.results
			is there, location entered results in multiple resulting locations;
			strategic decision to use unique zmw-id of first matching location
			for another request. if user wanted other location, needs to enter
			the location with more details
		- if data.current_observation and data.response.results doesn't exist,
			there is no data for the location entered, vm.manual.notFound gets
			set to true, informing user in view about no results for this query
		- vm.manual.userInput stores the location entered by user
		-	vm.manual.apiOutput stores unique id of first location returned by
			api in case of no unique location
		- vm.ongoingQuery is necessary for managing the messages displayed
			in view	*/
	vm.manualQuery = function() {
		// set/reset data for proper display of messages in view
		vm.manual.notFound = false;
		vm.manual.ongoingQuery = true;
		vm.current = {
			position: {},
			conditions: {},
			tempScale: vm.current.tempScale
		};
		// first run uses userInput, second run uses apiOutput
		var query = vm.manual.userInput;
		if (vm.manual.apiOutput !== "") {
			query = vm.manual.apiOutput;
		}
		forecastSvc.getCurrentConditions(query).then(function(result) {
			// location entered matches unique location
			if (result.data.current_observation) {
				vm.manual.ongoingQuery = false;
				vm.current.conditions = result;
				vm.current.place = vm.current.conditions.data.current_observation.display_location.full;
				vm.current.temperatureC = vm.current.conditions.data.current_observation.temp_c;
				vm.current.temperatureF = vm.current.conditions.data.current_observation.temp_f;
				vm.current.weather = vm.current.conditions.data.current_observation.weather;
				vm.current.icon = vm.current.conditions.data.current_observation.icon_url;
				vm.manual.userInput = "";
				vm.manual.apiOutput = "";
			}
			else {
				// location entered matches several locations
				if (result.data.response.results) {
					vm.manual.apiOutput = "zmw:" + result.data.response.results[0].zmw;
					// recursive call of manualQuery, this time using apiOutput data
					vm.manualQuery();
				}
				// no location matches location entered
				else {
					vm.manual.userInput = "";
					vm.manual.apiOutput = "";
					vm.manual.ongoingQuery = false;
					vm.manual.notFound = true;
				}
			}
		})			
	}
	
	vm.automaticQuery();
	
}]);