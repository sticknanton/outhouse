var ctlr = angular.module('mapControllers', [])

ctlr.controller('mapController', ['$scope','outhousesApi','$cookies','tokenService','$rootScope','$compile','$document', function ($scope, outhousesApi, $cookies, tokenService, $rootScope, $compile, $document) {
  $scope.outhouses = [];
  $scope.createNew = function (outhouse) {
    outhouse.poster = $cookies.get('user');
    outhouse.position = {};

    outhousesApi.addressLatLng(outhouse).then(function (addressResponse) {
      outhouse.position.lat = addressResponse.data.results[0].geometry.location.lat;
      outhouse.position.lng = addressResponse.data.results[0].geometry.location.lng;
        outhousesApi.createNew(outhouse).then(function (response) {
          $scope.outhouses.push(response.data)
          $rootScope.outhouse = {};
          $rootScope.openForm=false;
          $scope.addMarker(response.data);
        })
    })

  }

  $scope.infoContent = function(outhouse){
    return '<div><h1>' + outhouse.title + '</h1><br><h3>' + outhouse.rating + '</h3><br><a href="#"><p>' + outhouse.description + '</p></a></div>'
  }

  $scope.markerWindows = function (marker, outhouse) {
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
      $scope.markerWindows(marker, outhouse)
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


  CenterControl = function(controlDiv, myMap) {

    var controlUI = document.createElement('div');
      controlUI.title = 'Test the stuff';
      controlUI.style.backgroundColor = 'transparent';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginRight = '2px';
      controlUI.title = 'Click to open the form';
      controlUI.style.textAlign = 'right';
      controlUI.innerHTML = '<i ng-show="logged" class="fa fa-plus-circle"></i>';
      controlUI.style.fontSize = '35px';
      controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
      controlText.innerHTML = '<form class="newOuthouseForm" ng-submit="createNew(outhouse)" ng-show="openForm"><input type="text" ng-model="outhouse.address" placeholder="address"><input type="text" ng-model="outhouse.city" placeholder="city"><input type="text" ng-model="outhouse.state" placeholder="state"><input type="text" ng-model="outhouse.title" placeholder="title"><input type="text" ng-model="outhouse.description" placeholder="title"><input class="logger" type="submit"></form>'
      $compile( controlText )($scope);

      controlUI.appendChild(controlText);
      $compile( controlUI )($rootScope);

    controlUI.firstChild.addEventListener('click', function() {
      console.log('clicked');
      if ($rootScope.openForm) {
        $rootScope.openForm = false;
        $compile( controlText )($rootScope);
      }else {
        $rootScope.openForm=true;
        $compile( controlText )($rootScope);
      }


    });

}
  var myMap = {};
  myMap.init = function() {
      this.map;
      this.currentLatLng;
      this.mapEl;
      var mapScope = this;
      this.zoom=16;
      this.mapEl = document.querySelector('#map')
      navigator.geolocation.getCurrentPosition(function(pos) {
        scope.initialize(pos.coords)
      })

      this.initialize = function (pos) {
        mapScope.currentLatLng = new google.maps.LatLng(pos.latitude, pos.longitude);
        mapScope.currentLatLng = new google.maps.LatLng(pos.latitude, pos.longitude);
        mapScope.map = new google.maps.Map(mapScope.mapEl, {
        mapScope.map = new google.maps.Map(mapScope.mapEl, {
        mapScope.map = new google.maps.Map(mapScope.mapEl, {
          center: mapScope.currentLatLng,
          center: mapScope.currentLatLng,
          zoom: mapScope.zoom,
          zoom: mapScope.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        $scope.getOuthouses();
        $scope.getOuthouses();
        var newOuthouseDiv = document.createElement('div');
        var centerControl = new CenterControl(newOuthouseDiv, mapScope.map);
        console.log(centerControl);
        newOuthouseDiv.index = 1;
        mapScope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(newOuthouseDiv);

        // var centerControlDiv = document.createElement('div');
        // var centerControl = new CenterControl(centerControlDiv, map);
        //
        // centerControlDiv.index = 1;
        // map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
      }
      $rootScope.openForm=false;
    }

  myMap.init();

}])
