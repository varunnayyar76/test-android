'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
])
  .config(function ($stateProvider, $urlRouterProvider) {
    // $httpProvider.defaults.useXDomain = true;
    // delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('login', {
        url: '/',
        templateUrl: 'main/templates/login.html',
        controller: 'LoginController'
      })
      .state('signin', {
        url: '/register',
        templateUrl: 'main/templates/register.html',
        controller: 'RegisterController'
      })
      .state('forgotpassword', {
        url: '/forgotPassword',
        templateUrl: 'main/templates/forgotpassword.html',
        controller: 'PasswordController',
        resolve: {
          getData: function () {
            return false;
          }
        }
      })
      .state('resetPassword', {
        url: '/resetPassword/:token',
        templateUrl: 'main/templates/resetpassword.html',
        controller: 'ResetPasswordController'
      })
      .state('changePassword', {
        url: '/changePassword',
        templateUrl: 'main/templates/changepassword.html',
        controller: 'PasswordController',
        params: {
          data: null,
        },
        resolve: {
          getData: function ($stateParams) {
            var profile = $stateParams.data;
            if (profile) { return profile }
            else { return false; }
          }
        }
      })
      .state('userProfile', {
        url: '/userProfile/:id',
        templateUrl: 'main/templates/profile.html',
        controller: 'ProfileController',
        resolve: {
          getProfile: function (ProfileService, $stateParams) {
            var profileID = $stateParams.id;
            if (profileID) { return ProfileService.getProfile(profileID); }
            else { return false; }
          }
        }
      })
      .state('editUserProfile', {
        url: '/editUserProfile',
        templateUrl: 'main/templates/editProfile.html',
        controller: 'EditProfileController',
        params: {
          data: null,
        },
        resolve: {
          getProfileData: function ($stateParams) {
            var data = $stateParams.data;
            if (data) { return data; }
            else { return false; }
          }
        }
      })
  });
