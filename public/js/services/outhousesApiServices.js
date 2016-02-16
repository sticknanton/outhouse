var api = angular.module('outhousesApi', [])

api.factory('outhousesApi', ['$http', function ($http) {
  var baseUrl = '/api/outhouses';
  var outhousesApi = {}
  outhousesApi.newLoc = function (location) {
    var googleUrl= 'https://maps.googleapis.com/maps/api/geocode/json?address='+location+'&key=AIzaSyDrW9vJiZVTZ1V8P-FdnutfMIx6DWKVV7g'
    return $http.get(googleUrl);
  }

  outhousesApi.addressLatLng = function (outhouse) {
    var googleUrl= 'https://maps.googleapis.com/maps/api/geocode/json?address='+outhouse.address+',+'+outhouse.city+',+'+outhouse.state+'&key=AIzaSyDrW9vJiZVTZ1V8P-FdnutfMIx6DWKVV7g'
    return $http.get(googleUrl)
  }
  outhousesApi.createNew = function (outhouse) {

    return $http.post(baseUrl, {outhouse: outhouse})
  }
  outhousesApi.updateOuthouse= function (outhouse) {
    return $http.patch(baseUrl+'/'+outhouse._id, { outhouse, outhouse} )
  }
  outhousesApi.getAll = function () {
      return $http.get(baseUrl)
  }
  return outhousesApi;
}])
