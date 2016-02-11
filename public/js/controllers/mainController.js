var ctlr = angular.module('mainControllers', [])

ctlr.controller('mainController', ['$scope','$http','$cookies','usersApi','tokenService','$rootScope', function ($scope, $http, $cookies, usersApi, tokenService, $rootScope) {

  $scope.outhouses=[];

  $scope.createUser = function(user){
    usersApi.createUser(user).then(function (response) {
      $scope.user = {};
      $scope.logIn(user.username, user.password);
    })
  }

  $scope.logIn = function(username, password) {
    usersApi.auth(username, password).then(function(response) {
      if(response.data.token){
        $scope.cookieStuff(response)
        $scope.setUser(response)
      }else {
          $scope.username=''; $scope.password='';
      }
    })
  }
  $scope.setUser = function(response){
    $rootScope.currentUser = response.config.data.username;
    $rootScope.logged = true;
    $scope.loggingIn = false;
    $scope.signingUp = false;
    $scope.username='';
    $scope.password='';
    console.log($rootScope.logged);
  }
  $scope.cookieStuff = function (response) {
    $cookies.put('user', response.config.data.username);
    $cookies.put('token', response.data.token);
  }
  $scope.logOut = function () {
    $cookies.remove('user');
    $cookies.remove('token');
    $rootScope.logged = false;
    $rootScope.currentUser = '';
  }
  $scope.checkToken = function() {
    var token = tokenService.check();
    if(token){
      $rootScope.logged=true;
      $rootScope.currentUser=$cookies.get('user');
    }
  }
  $scope.toggleLogIn = function () {
    if($scope.loggingIn){
      $scope.loggingIn=false;
    }else {
      $scope.loggingIn=true;
    }
    $scope.signingUp=false;
  }
  $scope.toggleSignUp = function () {
    if($scope.signingUp){
      $scope.signingUp=false;
    }else {
      $scope.signingUp=true;
    }
    $scope.loggingIn=false;
  }
  var init = function () {
   $scope.checkToken();
   $scope.searchOnly=false;
   $scope.signingUp=false;
   $scope.loggingIn = false;
  };
  init();

}])
