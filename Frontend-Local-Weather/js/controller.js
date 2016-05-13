angular.module("localWeather").controller("ForecastCtrl", ["locationSvc", "forecastSvc", function(locationSvc, forecastSvc) {
	var vm = this;
	
	vm.current = {
		position: {},
		forecast: {},
		tempScale: "C"
	};
	vm.geoLocSupport = true;
	
	vm.initialize = function() {
		locationSvc.geoLocation.getPosition().then(function(result) {
			vm.current.position.coords = result.coords;
			console.log(vm.current.position.coords);
			forecastSvc.getCurrentForecast(vm.current.position).then(function(result) {
				console.log(result);
				vm.current.forecast = result;
				vm.current.place = vm.current.forecast.data.current_observation.display_location.full;
				vm.current.temperatureC = vm.current.forecast.data.current_observation.temp_c;
				vm.current.temperatureF = vm.current.forecast.data.current_observation.temp_f;
				vm.current.weather = vm.current.forecast.data.current_observation.weather;
				vm.current.icon = vm.current.forecast.data.current_observation.icon_url;
			})			
		},
    function(error) {
			vm.geoLocSupport = false;
			console.log("error", error);
		}); 
	};
	
	vm.initialize();
	
}]);