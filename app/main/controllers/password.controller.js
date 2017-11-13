'use strict';
angular.module('main')
	.controller('PasswordController',
	function (
		$scope,
		$state,
		LoginService,
		getData,
		$ionicModal,
		$ionicLoading
	) {
		$scope.title = "Forgot Password ";
		$scope.profileData = [];
		if (getData) {
			$scope.profileData = getData;
		}
		
		$ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
			scope: $scope,
			backdropClickToClose: true,
			hardwareBackButtonClose: true
		}).then(function (modal) {
			$scope.modal = modal;
		});

		//for forgot password
		$scope.forgotpwd = function () {
			$ionicLoading.show({
				template: 'Please wait.'
			});
			var resetPwAddress = $state.href('resetPassword', {}, { absolute: true });
			$scope.error = '';
			$scope.success = '';
			var data = {
				email: $scope.email,
				address: resetPwAddress
			};
			LoginService.forgotPassword(data).then(function (resp) {
				$ionicLoading.hide();
				if (resp.type === 'success') {
					$scope.success = resp.message;
					$scope.openModal();					
				} else {
					$scope.error = resp.message;
					$scope.openModal();
				}
			}).catch(function (err) {
				$scope.error = "Please try again.";
				$scope.openModal();
				console.log("service error", err);
			})
		};

		$scope.changePassword = function () {
			$scope.error = '';
			$scope.success = '';
			$scope.submitted = true;
			if ($scope.profileData.password === $scope.password) {
				if ($scope.newpassword !== $scope.password) {
					if ($scope.newpassword === $scope.repassword) {
						$scope.profileData.newpassword = $scope.newpassword;
						LoginService.changePassword($scope.profileData).then(function (resp) {
							if (resp.type === 'success') {
								$scope.success = resp.message;
								localforage.setItem('user_id', resp.userid).then(function (done) {
									if (done) {
										$state.go("userProfile", { id: resp.userid });
										$scope.openModal();
									}
								}).catch(function (err) {
									console.log(err);
								});
							} else {
								$scope.error = resp.message;
								$scope.openModal();
							}
						}).catch(function (err) {
							console.log("service error", err);
						})
					} else {
						$scope.error = 'New Password and Confirm password are not same.';
						$scope.openModal();
						return false;
					}
				} else {
					$scope.error = 'Password and New Password are same.';
					$scope.openModal();
					return false;
				}
			} else {
				$scope.error = 'Password does not match with your old password.';
				$scope.openModal();
				return false;
			}
		};

		$scope.openModal = function () {
			$scope.modal.show();
		};

		$scope.closeModal = function () {
			$scope.modal.hide();
		};

		$scope.$on('$destroy', function () {
			$scope.modal.remove();
		});

	});
