'use strict';
angular.module('main')
  .controller('EditProfileController',
  function (
    $scope,
    $state,
    ProfileService,
    getProfileData,
    $ionicLoading,
    $ionicModal
  ) {
    if(getProfileData){
      $scope.profile = getProfileData; 
    }

    $ionicModal.fromTemplateUrl('main/templates/showMsg.html', {
      scope: $scope,
      backdropClickToClose: true,
      hardwareBackButtonClose: true
    }).then(function (modal) {
      $scope.modal = modal;
    });
    
    $scope.editProfile = function () {
      $ionicLoading.show({
        template: 'Please wait...'
      })
      $scope.success = '';
      $scope.error = '';
      ProfileService.editProfile($scope.profile).then(function (resp) {
        $ionicLoading.hide();
        if (resp.type === 'success') {
          $scope.success = resp.message;
          $state.go("userProfile", {id : resp.userid });
        } else {
          $scope.error = resp.message;
          $scope.openModal(); 
        }
      }).catch(function (err) {
        console.log(err);
        $ionicLoading.hide();
        $scope.error = 'Please try again.';            
        $scope.openModal(); 
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
