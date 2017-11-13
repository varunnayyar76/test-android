'use strict';
angular.module('main')
.controller('RegisterController', ["$scope", "$state", "LoginService", "$ionicModal",
    function ($scope, $state, LoginService, $ionicModal) {

        $ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
            scope: $scope,
            backdropClickToClose: true,
            hardwareBackButtonClose: true
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.register = function () {
            var regData = {
                firstname: $scope.firstName,
                lastname: $scope.lastName,
                email: $scope.email,
                pass: $scope.password
            };

            LoginService.register(regData).then(function (resp) {
                if (resp.type === 'success') {
                    $state.go('userProfile');
                } else {
                    $scope.error = resp.message;
                    $scope.openModal();
                }
            }).catch(function (err) {
                $scope.error = 'Please try again.';
                $scope.openModal();
                console.log("service error", err);
            })
        };

        $scope.reset = function () {
            $scope.firstName = '';
            $scope.lastName = '';
            $scope.email = '';
            $scope.password = '';
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

}]);