var app = angular.module('FiltroApp', ['ngRoute', 'ui.bootstrap', 'ngSanitize'])

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
		.when("/result/:trend", {
			templateUrl: "partials/result.html",
			controller: "resultController"
		})
		.when("/top_result", {
			templateUrl: "partials/top_result.html",
			controller: "topResultController"
		})
		.when("/top_result/:trend", {
			templateUrl: "partials/top_result.html",
			controller: "topResultController"
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
	'url' : 'http://localhost:9393'
})

.factory('trendsFactory', function(){
	var factory = {};
	var trends = [];
	factory.setTopTrends = function(){
		// Replace in the future
		trends = ['tech', 'sports', 'breaking news', 'entertainment']
	}

	factory.getTopTrends = function() {
		factory.setTopTrends();
		return trends;
	};

	return factory;
})

.factory('tweetFactory', ['$http', '$location', 'API_INFO', function($http, $location, API_INFO){
	var factory = {};
	var tweetsAndAccountInfo = [];
	
	factory.retrieveTweets = function(searchTerm) {
		return $http.post(API_INFO.url + '/getTweets', {'searchTerm' : searchTerm})
	};

	factory.setTweets = function(tweetsInfo){
		tweetsAndAccountInfo = tweetsInfo; 
	};
	
	factory.getTweets = function(){
		return tweetsAndAccountInfo;
	};

	return factory;
}])

.controller('searchController', ['$http', '$location', '$scope', 'trendsFactory','tweetFactory', function($http, $location, $scope, trendsFactory, tweetFactory){
	$scope.searchData;
	$scope.gettingTweets = false;
	$scope.trends = [];
	$scope.init = function(){
		$scope.trends = trendsFactory.getTopTrends();
		$scope.searchData = {};
	}
	$scope.init();

	$scope.submitForm = function(){
		$scope.gettingTweets = true; // Display loading donut on submit
		tweetFactory.retrieveTweets($scope.searchData.term).then(function (res){
			tweetFactory.setTweets(res.data);
			$location.path('result')
		})
	};

	$scope.getTrend = function(trend) {
		$location.path("top_result/" + trend);
	};
}])

.controller('indexController',['$scope', '$location', function($scope, $location){
	$scope.searchTerm = "";
	$scope.submitForm = function(){
		$location.path('result/' + $scope.searchTerm);
	};
}])

.controller('resultController', ['$scope', '$location', '$routeParams', 'tweetFactory', 'trendsFactory', function($scope, $location, $routeParams, tweetFactory, trendsFactory){
	$scope.tweetsAndAccountInfo = [];
	$scope.trends = [];
	$scope.init = function () {
		$scope.trend = $routeParams["trend"];
		if ($scope.trend !== undefined) {
			$scope.trends = trendsFactory.getTopTrends();
			$scope.loadingTweets = true;
			tweetFactory.retrieveTweets($scope.trend).then(function (res){
				tweetFactory.setTweets(res.data);
				$scope.tweetsAndAccountInfo = tweetFactory.getTweets();
				console.log($scope.tweetsAndAccountInfo);
				$scope.loadingTweets = false;
				if ($scope.tweetsAndAccountInfo.length === 0) {
					$location.path("search");
				}
			})
		}
		else {
			$scope.trends = trendsFactory.getTopTrends();
			$scope.tweetsAndAccountInfo = tweetFactory.getTweets();
			if ($scope.tweetsAndAccountInfo.length === 0) {
				$location.path("search");
			}
			console.log($scope.tweetsAndAccountInfo);
		}
	}
	$scope.init();

	$scope.getTrend = function(trend) {
		$location.path("top_result/" + trend);
	};
}])

.controller('topResultController', ['$location','$scope', 'trendsFactory', 'tweetFactory', '$routeParams', function($location, $scope, trendsFactory, tweetFactory, $routeParams){
	$scope.tweetsAndAccountInfo = [];
	$scope.trends = []
	$scope.trend;
	$scope.activeTab = {};
	$scope.loadingTweets = true;
	$scope.init = function () {
		$scope.trend = $routeParams["trend"];
		console.log($routeParams);
		if ($scope.trend === undefined) {
			$location.path("search");
		}
		$scope.activeTab[$scope.trend] = true;
		tweetFactory.retrieveTweets($scope.trend).then(function (res){
			tweetFactory.setTweets(res.data);
			$scope.trends = trendsFactory.getTopTrends();
			$scope.tweetsAndAccountInfo = tweetFactory.getTweets();
			console.log($scope.tweetsAndAccountInfo);
			$scope.loadingTweets = false;
		})
	}
	$scope.init();

	$scope.getTweets = function(trend){
		$scope.tweetsAndAccountInfo = [];
		$scope.loadingTweets = true;
		tweetFactory.retrieveTweets(trend).then(function (res){
			tweetFactory.setTweets(res.data);
			$scope.trends = trendsFactory.getTopTrends();
			$scope.tweetsAndAccountInfo = tweetFactory.getTweets();
			console.log($scope.tweetsAndAccountInfo);
			$scope.loadingTweets = false;
		})
	}
}])
