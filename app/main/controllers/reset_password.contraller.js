'use strict';
angular.module('main')
  .controller('ResetPasswordController',
  function (
    $scope,
    LoginService,
    $stateParams,
    $state,
    $ionicModal,
    $ionicLoading
  ) {
    $ionicLoading.show({
      template: 'Checking token...'
    });
    var self = this;
    var token = $stateParams.token;
    $scope.modal = '';

    $ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
      scope: $scope,
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    }).then(function (modal) {
      $scope.modal = modal;
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

    if (token) {
      LoginService.checkPwToken(token).then(function (resp) {
        $ionicLoading.hide();
        if (resp.type === 'success') {
          self.user_id = resp.userid;
        } else {
          $scope.error = resp.message;
          $scope.openModal();
        }
      })
    } else {
      $ionicLoading.hide();
      $scope.error = "No token";
      $state.go("signin");
    }

    $scope.resetPw = function () {
      $ionicLoading.show({
        template: 'Please wait...'
      });
      $scope.success = '';
      $scope.error = '';
      var data = {
        password: $scope.password,
        user_id: self.user_id
      };
      LoginService.resetPassword(data).then(function (resp) {
        $ionicLoading.hide();
        if (resp.type === 'success') {
          $scope.success = resp.message;
          $state.go('login');
        } else {
          $scope.error = resp.message;
          $scope.openModal();
        }
      })
        .catch(function (err) {
          $ionicLoading.hide();
          $scope.error = "An Error occured.Please try again";
          $scope.openModal();
          console.log(err);
        })
    };

  });