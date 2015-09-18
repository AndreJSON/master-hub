/*global angular*/

var masterApp = angular.module('masterApp', ['ngMaterial', 'ngRoute', 'ngMdIcons']);

masterApp.config(function ($routeProvider) {
	'use strict';
	
	$routeProvider
		.when('/', {
			templateUrl: 'views/home.html'
		})
		.when('/home', {
			templateUrl: 'views/home.html'
		})
		.when('/about-me', {
			templateUrl: 'views/about-me.html'
		})
		.when('/angular', {
			templateUrl: 'views/angular.html'
		})
		.when('/astervoid', {
			templateUrl: 'views/astervoid.html'
		})
		.when('/catch-it', {
			templateUrl: 'views/catch-it.html',
			controller: 'catchItController'
		})
		.when('/sorting', {
			templateUrl: 'views/sorting.html'
		})
		.otherwise({
			templateUrl: 'views/404.html'
		});
});