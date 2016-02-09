var ctlr = angular.module('mapControllers', [])

ctlr.controller('mapController', ['$scope','outhousesApi','$cookies','tokenService','$rootScope', function ($scope, outhousesApi, $cookies, tokenService, $rootScope) {
  $scope.outhouses = [];
  $scope.createNew = function (outhouse) {
    outhouse.poster = $cookies.get('user');
    outhouse.position = {};

    outhousesApi.addressLatLng(outhouse).then(function (addressResponse) {
      outhouse.position.lat = addressResponse.data.results[0].geometry.location.lat;
      outhouse.position.lng = addressResponse.data.results[0].geometry.location.lng;
        outhousesApi.createNew(outhouse).then(function (response) {
          $scope.outhouses.push(response.data)
          $scope.outhouse = {};
          $scope.addMarker(response.data);
        })
    })

  }

  $scope.infoContent = function(outhouse){
    return '<div><h1>' + outhouse.title + '</h1><br><h3>' + outhouse.rating + '</h3><br><p>' + outhouse.description + '</p></div>'
  }

  $scope.markerWindows = function (marker,outhouse) {
    marker.info = new google.maps.InfoWindow({
      content: $scope.infoContent(outhouse)
    });
    google.maps.event.addListener(marker, 'click', function() {
      marker.info.open(myMap.map, marker);
    });
  }

  $scope.addMarker = function (outhouse) {
    var image = '/images/outhouse.png';

    var marker = new google.maps.Marker({
        map: myMap.map,
        position: new google.maps.LatLng(outhouse.position.lat, outhouse.position.lng),
        icon: image
      });
      $scope.markerWindows(marker,outhouse)
      marker.setMap(myMap.map);
  }

  $scope.getOuthouses = function () {
    outhousesApi.getAll().then(function (response) {
      $scope.outhouses = response.data.outhouses;

      $scope.outhouses.forEach(function (outhouse) {
        $scope.addMarker(outhouse);
      })
    })
  }

  var myMap = {};

  myMap.init = function() {

      this.map;
      this.currentLatLng;
      this.mapEl;
      var scope = this
      this.zoom=16;
      this.mapEl = document.querySelector('#map')
      navigator.geolocation.getCurrentPosition(function(pos) {
        scope.initialize(pos.coords)
      })

      this.initialize = function (pos) {
        scope.currentLatLng = new google.maps.LatLng(pos.latitude, pos.longitude);
        scope.map = new google.maps.Map(scope.mapEl, {
          center: scope.currentLatLng,
          zoom: scope.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        $scope.getOuthouses();

        console.log($rootScope);
      }
    }

  myMap.init();

}])
