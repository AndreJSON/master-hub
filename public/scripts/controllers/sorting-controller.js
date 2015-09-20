/*global masterApp*/

masterApp.controller('sortingController', function ($scope, $log) {
	'use strict';
	$log.info('Sorting controller up and running.');
	
	$scope.algorithms = ["Bogosort", "Bubblesort", "Quicksort"];
	$scope.selectedAlgorithm = "";
	
});