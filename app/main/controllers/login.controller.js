'use strict';
angular.module('main')
  .controller('LoginController',
  function (
    $scope,
    LoginService,
    $ionicLoading,
    $state,
    $ionicModal
    ) {
      
    $ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
      scope: $scope,
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.formSubmit = function () {
      $ionicLoading.show({
        template: 'Please wait...'
      });
      $scope.success = '';
      $scope.error = '';
      var data = {
        email: $scope.email,
        pass: $scope.password
      };
      LoginService.login(data).then(function (resp) {
        $ionicLoading.hide();
        if (resp.type === 'success') {
          $scope.success = resp.message;
          localforage.setItem('user_id', resp.userid).then(function (done) {
            if (done) {
              $state.go("userProfile", { id: resp.userid });
            }
          }).catch(function (err) {
            $scope.error = 'We are having problem logging you in.Please try again.';
            $scope.openModal();                      
            console.log(err);
          });
        } else {
          $scope.error = resp.message;
          $scope.openModal();          
        }
      }).catch(function (err) {
        $ionicLoading.hide();
        $scope.error = 'We are having problem logging you in.Please try again.';
        $scope.openModal();   
        console.log(err);        
      })
    };

    $scope.openModal = function () {
      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });

  });
