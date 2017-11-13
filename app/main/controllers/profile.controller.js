'use strict';
angular.module('main')
	.controller('ProfileController',
	function (
		$scope,
		LoginService,
		getProfile,
		$ionicModal,
		$ionicLoading,
		$cordovaFileTransfer,
		$cordovaCamera
		) {

		$ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
			scope: $scope,
			backdropClickToClose: true,
			hardwareBackButtonClose: true
		}).then(function (modal) {
			$scope.modal = modal;
		});
		var Camera;

		$scope.showMenu = true;
		if (getProfile.type === 'success') {
			$scope.profile = getProfile.data;
		}

		$scope.checkIn = function () {
			$ionicLoading.show({
				template: 'Please wait...'
			});
			$scope.error = '';
			$scope.success = '';
			LoginService.checkIn($scope.profile).then(function (resp) {
				$ionicLoading.hide();
				if (resp.type === 'success') {
					$scope.success = resp.message;
					$scope.openModal();
				} else {
					$scope.error = resp.message;
					$scope.openModal();
				}
			}).catch(function (err) {
				$ionicLoading.hide();
				$scope.error = "Service error";
				$scope.openModal();
				console.log("service error", err);
			})
		};

		$scope.uploadImg = function () {
			this.data = "inside function";
			var options = {
				quality: 100,
				destinationType: Camera.DestinationType.DATA_URL,
				sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
				mediaType: Camera.MediaType.ALLMEDIA
			};
			$cordovaCamera.getPicture(options)
				.then(function (imageData) {
					this.data = JSON.stringify("hello" + imageData);
					imageData = imageData.split('?');
					var imageURI = imageData[0];
					var fileType = imageURI.substr(imageURI.lastIndexOf('/') + 1)
						.split('.')
						.pop()
						.toLowerCase();
					var fileExtension = ['jpeg', 'jpg', 'png', 'gif'];
					if (fileExtension.indexOf(fileType) === -1) {
						$scope.errorMessage('UNSUPPORTED_FILE');
						return false;
					}
					var Options = {
						fileKey: 'file',
						fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
						mimeType: 'text/html',
						httpMethod: 'POST',
						headers: {
							'X-Requested-With': 'XMLHttpRequest',
						}
					};
					var urlAPI = "http://demo7880363.mockable.io/login";

					$cordovaFileTransfer.upload(urlAPI, imageURI, Options)
						.then(function (result) {
							var jsonData = JSON.parse(result.response);
							console.log(jsonData);
						});
				}).catch(function(err){
					this.data = JSON.stringify("hello err" + err);
				});
		}

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
