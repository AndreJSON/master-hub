/*global masterApp*/

masterApp.controller('mainController', function ($scope, $log, $mdComponentRegistry, $mdMedia, $mdSidenav, $timeout) {
	'use strict';
	$scope.views = ['home', 'about-me', 'angular', 'astervoid', 'catch-it', 'sorting'];
	
	$scope.toggleSideNav = function (state) {
		$log.info(state);
		if (state === 'close') {
			$mdSidenav('sideNav').close();
		} else if (state === 'open') {
			$mdSidenav('sideNav').open();
		}
	};
	
	$timeout($mdComponentRegistry.when('sideNav').then(function () {
		if ($mdMedia('gt-sm')) {
			$mdSidenav('sideNav').open();
		}
	}));
	
});