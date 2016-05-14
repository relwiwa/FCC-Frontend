var myWV = angular.module("myWV", ["ngAnimate"]);

myWV.controller("ControllerMain", function($scope, $http) {
  $scope.srchTrm = "";
  $scope.rsltTtls = [];
  $scope.rsltDscrp = [];
  $scope.rsltLnks = [];
  $scope.infoText;
  
  $scope.submitSearch = function() {
    if ($scope.srchTrm !== "") {
      var url = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&search=" + $scope.srchTrm + "&limit=8&callback=JSON_CALLBACK";
      $http.jsonp(url, {
        'Api-User-Agent': 'Example/1.0'
      })
      .then(function(data) {
        if ($scope.srchTrm !== "") {
          $scope.rsltTtls = data["data"][1];
          $scope.rsltDscrp = data["data"][2];
          $scope.rsltLnks = data["data"][3];
        }
      }, function(err) {
        $scope.infoText = err;
      });
    }
    else {
      $scope.rsltTtls = [];
    }
  }
   
  $scope.changeLocation = function(href) {
    window.open(href, '_blank');
  }

});