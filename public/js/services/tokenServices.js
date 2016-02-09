var token = angular.module('tokenServices', [])

token.factory('tokenService', ['$cookies', function ($cookies) {
  var tokenService = {}
  tokenService.check = function () {
    var token = $cookies.get('token');
    return token;
  }
  return tokenService
}])
