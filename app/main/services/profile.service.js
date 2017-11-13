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