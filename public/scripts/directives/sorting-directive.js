var masterApp;

masterApp.directive('sorting', function () {
	'use strict';
	return {
		restrict: 'E',
		templateUrl: '/templates/sorting-template.html',
		scope: {
			gameWidth: '=',
			gameHeight: '='
		},
		link: function (scope, element) {
			scope.canvas = element.find('canvas')[0].getContext('2d');
		},
		controller: 'sortingController'
	};
});