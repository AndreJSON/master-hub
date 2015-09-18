var masterApp;

masterApp.directive('astervoid', function () {
	'use strict';
	return {
		restrict: 'E',
		templateUrl: '/templates/astervoid-template.html',
		scope: {
			gameWidth: '=',
			gameHeight: '='
		},
		link: function (scope, element) {
			scope.canvas = element.find('canvas')[0].getContext('2d');
		},
		controller: 'astervoidController'
	};
});