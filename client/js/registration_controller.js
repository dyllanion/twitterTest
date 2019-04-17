'use strict';

//url for the api
var apiUrl = 'https://goboard-analytics.herokuapp.com/api/';

//app definition of an angular module called registration

//var app = angular.module('registration', []);
var app = angular.module('registration', []);

//this module called app has a controller called registration_controller
//this has a scope and utilizes the http protocol module in angular
app.controller('registration_controller', function($scope, $http){

    //email of the scope
    $scope.email = null;

    //username of the scope which is derived by parsing the email before the @
    $scope.username = null;

    //password of the scope
    $scope.password = null;

    //password confirmation of the scope
    $scope.passwordConf = null;

    //a function to take in the various parameters and send in an object to api
    $scope.postdata = function (email, password, passwordConf) {

      //data entity will contain all attributes of the user to be added
      var data = {
      email: email,   //user's email
      username: email.substring(0, email.indexOf("@")), //user's username
      password: password, //user's password
      passwordConf: passwordConf  //user's password confirmation
      };

      console.log("Data is " , data)
      //send through the http protocol the stringified data to api post
      var posting = $.post( apiUrl, data );
      console.log("Data returned from register is ", posting)
      // $http.post(apiUrl , data,
      // .then(function (response) {
      //   if(response.data)
      //     console.log("Post made successfully", response);
      //   })
      // );
    };

});
