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
    return '<div><h3>' + outhouse.title + '</h3><h4>' + outhouse.rating + ' out of 5 stars </h4><br><h6>' + outhouse.description + '</h6></div>'
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
      controlUI.className="newFormCaller"
      controlUI.innerHTML = '<i ng-show="logged" class="fa fa-plus-circle"></i>';
      controlUI.style.fontSize = '35px';
      controlDiv.appendChild(controlUI);

    var controlText = document.createElement('div');
      controlText.innerHTML = '<div id="outhouseFormHolder" ng-show="openForm"><h2>Add Another Outhouse!</h2><form class="newOuthouseForm" ng-submit="createNew(outhouse)"><input type="text" ng-model="outhouse.address" placeholder="address"><input type="text" ng-model="outhouse.city" placeholder="city"><input type="text" ng-model="outhouse.state" placeholder="state"><input type="text" ng-model="outhouse.title" placeholder="title"><br><div class="stars"><input class="star star-5" id="star-5" type="radio" ng-model="outhouse.rating" name="star" value="5"/><label class="star star-5" for="star-5"></label><input class="star star-4" id="star-4" type="radio" ng-model="outhouse.rating" name="star" value="4"/><label class="star star-4" for="star-4"></label><input class="star star-3" id="star-3" type="radio" ng-model="outhouse.rating" name="star" value="3"/><label class="star star-3" for="star-3"></label><input class="star star-2" id="star-2" type="radio" ng-model="outhouse.rating" name="star" value="2"/><label class="star star-2" for="star-2"></label><input class="star star-1" id="star-1" type="radio" ng-model="outhouse.rating" name="star" value="1"/><label class="star star-1" for="star-1"></label></div><br><textarea ng-model="outhouse.description" rows="2" cols="40"></textarea><br><input class="logger" type="submit"></form><br></div>'
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
        mapScope.initialize(pos.coords)
      })

      this.initialize = function (pos) {
        mapScope.currentLatLng = new google.maps.LatLng(pos.latitude, pos.longitude);
        mapScope.map = new google.maps.Map(mapScope.mapEl, {
          center: mapScope.currentLatLng,
          zoom: mapScope.zoom,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        });

        $scope.getOuthouses();
        var newOuthouseDiv = document.createElement('div');
        newOuthouseDiv.className="newFormCaller";
        var centerControl = new CenterControl(newOuthouseDiv, mapScope.map);
        console.log(centerControl);
        newOuthouseDiv.index = 1;
        mapScope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(newOuthouseDiv);
      }
      $rootScope.openForm=false;
    }

  myMap.init();

}])
