var masterApp;

masterApp.directive('sorting', function () {
	'use strict';
	return {
		restrict: 'E',
		templateUrl: '/templates/sorting-template.html',
		scope: {
			boxWidth: '=',
			boxHeight: '='
		},
		link: function (scope, element) {
		},
		controller: 'sortingController'
	};
});