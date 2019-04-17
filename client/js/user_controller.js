'use strict';

var apiUrl = 'https://goboard-analytics.herokuapp.com/api/';
var app = angular.module('users', []);

app.service('ngUsersService', function($http){

    this.getUsers = function()
    {
        var res = $http.get(apiUrl + 'users') 
        return res;

        
    }

});

app.controller('user_controller', function($scope, ngUsersService){

    this.selectedUser = {};
    var self = this;
    

    function LoadUsers()
    {
        var promise = ngUsersService.getUsers();
        promise.then(function(resp){
            $scope.AllUsers = resp.data;
            console.log("Users are", resp.data)
        }, function(err){
            alert('Call Failed');
        });


    };

    LoadUsers();

});