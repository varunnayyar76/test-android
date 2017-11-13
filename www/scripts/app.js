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

'use strict';
var app = angular.module('main');
app.factory('ProfileService',
    function (
        $http,
        Config
    ) {
        var HOST = Config.ENV.SERVER_URL;
        return {
            addProfile: addProfile,
            editProfile: editProfile,
            getProfile: getProfile
        };

        //service to add profile 
        function addProfile(data) {
            return $http.post(HOST + "addProfile", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to edit profile 
        function editProfile(data) {
            return $http.post(HOST + "editProfile", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to get profile info
        function getProfile(id) {
            return $http.get(HOST + "getProfile/" + id).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }
    });
'use strict';
var app = angular.module('main');
app.factory('LoginService',
    function (
        $http,
        Config
    ) {
        var HOST = Config.ENV.SERVER_URL;
        return {
            login: login,
            register: register,
            forgotPassword: forgotPassword,
            resetPassword: resetPassword,
            checkPwToken : checkPwToken,
            changePassword:changePassword,
            checkIn: checkIn
        };

        //service to login 
        function login(data) {
            return $http.post(HOST + "login", data, {
                'Content-Type': 'application/x-www-form-urlencoded'                
            }).then(function (response) {
				console.log(response.data);
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to register 
        function register(regData) {
            return $http.post(HOST + "register", regData).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to forgot password
        function forgotPassword(data) {
            return $http.post(HOST + "forgotPassword", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to reset password
        function resetPassword(data) {
            return $http.post(HOST + "resetPassword", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }
        //service to change password
        function changePassword(data) {
            return $http.post(HOST + "changePassword", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

        //service to check token
        function checkPwToken(data){
            return $http.post(HOST + "checkToken", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }
        
        //service to check In
        function checkIn(data){
            return $http.post(HOST + "checkIn", data).then(function (response) {
                return response.data;
            }, function (error) {
                return error.data;
            }).catch(function (err) {
                console.log("err", err);
            });
        }

    });

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

'use strict';
angular.module('main')
.controller('MenuCtrl', function ($log) {

  $log.log('Hello from your Controller: MenuCtrl in module main:. This is your controller:', this);

});

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

'use strict';
angular.module('main')
.controller('DebugCtrl', function ($log, $http, $timeout, Main, Config, $cordovaDevice) {

  $log.log('Hello from your Controller: DebugCtrl in module main:. This is your controller:', this);

  // bind data from services
  this.someData = Main.someData;
  this.ENV = Config.ENV;
  this.BUILD = Config.BUILD;
  // get device info
  ionic.Platform.ready(function () {
    if (ionic.Platform.isWebView()) {
      this.device = $cordovaDevice.getDevice();
    }
  }.bind(this));

  // PASSWORD EXAMPLE
  this.password = {
    input: '', // by user
    strength: ''
  };
  this.grade = function () {
    var size = this.password.input.length;
    if (size > 8) {
      this.password.strength = 'strong';
    } else if (size > 3) {
      this.password.strength = 'medium';
    } else {
      this.password.strength = 'weak';
    }
  };
  this.grade();

  // Proxy
  this.proxyState = 'ready';
  this.proxyRequestUrl = Config.ENV.SOME_OTHER_URL + '/get';

  this.proxyTest = function () {
    this.proxyState = '...';

    $http.get(this.proxyRequestUrl)
    .then(function (response) {
      $log.log(response);
      this.proxyState = 'success (result printed to browser console)';
    }.bind(this))
    .then($timeout(function () {
      this.proxyState = 'ready';
    }.bind(this), 6000));
  };

});

'use strict';
angular.module('main')
.constant('Config', {
  // gulp environment: injects environment vars
  ENV: {
    /*inject-env*/
    'SERVER_URL': 'http://demo7880363.mockable.io/',
    'SOME_OTHER_URL': '/postman-proxy'
    /*endinject*/
  },

  // gulp build-vars: injects build vars
  BUILD: {
    /*inject-build*/
    /*endinject*/
  }

});
'use strict';
angular.module('main')
.component('mini', {
  templateUrl: 'main/components/mini/mini-component.html',
  restrict: 'EA',
  transclude: true,
  bindings: {
    content: '=', // bind via attribute
  },
  controllerAs: 'ctrl', // enable controllerAs syntax
  controller: function (
    $scope,
    $state
  ) {
    // retrieve some info via dependency injection
    this.currentState = $state.current.name;
  }
});

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