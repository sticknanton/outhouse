var api = angular.module('usersApi', [])

api.factory('usersApi', ['$http', function ($http) {
  var baseUrl = '/api/users';
  var usersApi = {}
  usersApi.createUser = function (user) {
    return $http.post(baseUrl, {user: user})
  }
  usersApi.auth = function (username, password) {
    return $http.post(baseUrl+'/authenticate', {username: username, password: password})
  }
  return usersApi;
}])
