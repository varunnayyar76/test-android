'use strict';
angular.module('bhhr', [
	// load your modules here
	'main' // starting with the main module
])
	.run(function ($rootScope, $location) {
		$rootScope.body_class = false;
		$rootScope.editProfile_class = false;
		$rootScope.$on('$stateChangeSuccess',
			function (event, toState) {
				if (toState.name === "editUserProfile" || toState.name === "popup" || toState.name === "userProfile"|| toState.name === "changePassword") {
					$rootScope.body_class = true;
				} else {
					$rootScope.body_class = false;
				}
				if (toState.name === "editUserProfile" || toState.name === "changePassword") {
					$rootScope.editProfile_class = true;
				}
			})

		$rootScope.location = $location;
	})