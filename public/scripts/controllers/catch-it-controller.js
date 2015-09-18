/*global masterApp*/

masterApp.controller('catchItController', function ($http, $log, $scope) {
	'use strict';
	
	$scope.toSchool = [];
	$scope.fromSchool = [];
	$scope.deviations = [];
	
	//!!!!!! TODO: Make this a service.
	$scope.updateToSchool = function () {
		$http.get('/api/catch-it/travelplannerV2-trip/originid=5823&destid=9703&numchg=0').success(function (data) {
			$scope.toSchool[0] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/originid=5823&destid=9702&numchg=0').success(function (data) {
			$scope.toSchool[1] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/originid=9703&destid=1002&numchg=0').success(function (data) {
			$scope.toSchool[2] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/originid=1002&destid=9204&numchg=0').success(function (data) {
			$scope.toSchool[3] = data.TripList.Trip;
		});
	};
	
	$scope.updateFromSchool = function () {
		$http.get('/api/catch-it/travelplannerV2-trip/numtrips=5&originid=9204&destid=1002&numchg=0').success(function (data) {
			$scope.fromSchool[0] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/numtrips=5&originid=1002&destid=9702&numchg=0').success(function (data) {
			$scope.fromSchool[1] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/numtrips=5&originid=9703&destid=5823&numchg=0').success(function (data) {
			$scope.fromSchool[2] = data.TripList.Trip;
		});
		$http.get('/api/catch-it/travelplannerV2-trip/numtrips=5&originid=9702&destid=5823&numchg=0').success(function (data) {
			$scope.fromSchool[3] = data.TripList.Trip;
		});
	};
	
	$scope.updateDeviations = function () {
		$http.get('/api/catch-it/deviations/lineNumber=553,14,35').success(function (data) {
			$scope.deviations = data.ResponseData;
		});

	};

});