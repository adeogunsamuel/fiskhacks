var app = angular.module('FiltroApp', ['ngRoute', 'ui.bootstrap'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider
		.when("/", {
			templateUrl: "partials/search.html",
			controller: "searchController"
		})
		.when("/result", {
			templateUrl: "partials/result.html",
			controller: "resultController"
		})
		.otherwise({
			templateUrl: "partials/search.html",
			controller: "searchController"
		})
}])

.config(function($httpProvider) {
  //Enable cross domain calls
  $httpProvider.defaults.useXDomain = true;

  //Remove the header used to identify ajax call  that would prevent CORS from working
  delete $httpProvider.defaults.headers.common['X-Requested-With'];
})

.constant('API_INFO', {
	'url' : 'http://localhost:9393/'
})

.factory('tweetFactory', ['$http', '$location',function($http, $location){
	var factory = {};
	var tweetsAndAccountInfo = [];
	
	factory.setTweets = function(tweetsAndAccountInfo) {
		tweetsAndAccountInfo = tweetsAndAccountInfo;
		$location.path('/result')
	};
	
	factory.getTweets = function(){
		return tweetsAndAccountInfo;
	};

	return factory;
}])

.controller('searchController', ['$http', '$scope', 'tweetFactory', 'API_INFO', function($http, $scope, tweetFactory, API_INFO){
	$scope.searchData;
	$scope.gettingTweets = false;
	$scope.init = function(){
		$scope.searchData = {};
	}
	$scope.init();

	$scope.submitForm = function(){
		$scope.gettingTweets = true; // Display loading donut on submit
		$http.post(API_INFO.url + '/getTweets', {'searchTerm' : $scope.searchData.term})
			.success(function(res){
				console.log(res);
				tweetFactory.setTweets(res);
			})
			.error(function(res){
				console.log(res);
			})
	};
}])

.controller('resultController', ['$scope', '$location', 'tweetFactory', function($scope, $location, tweetFactory){
	$scope.tweetsAndAccountInfo = [];
	$scope.init = function () {
		$scope.tweetsAndAccountInfo = tweetFactory.getTweets();
	}
}])
