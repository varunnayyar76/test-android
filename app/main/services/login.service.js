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
