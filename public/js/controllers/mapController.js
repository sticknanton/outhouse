var ctlr = angular.module('mapControllers', [])

ctlr.controller('mapController', ['$scope','outhousesApi','$cookies','tokenService','$rootScope','$compile','$document', function ($scope, outhousesApi, $cookies, tokenService, $rootScope, $compile, $document) {
  $scope.outhouses = [];
  $scope.createNew = function (outhouse, rating) {
    $scope.outhouse.poster = $cookies.get('user');
    outhouse.ratings = [];
    $scope.rating = {};
    $scope.rating.username = $scope.outhouse.poster;
    $scope.rating.value = parseInt(rating);
    outhouse.ratings[0] = $scope.rating;
    outhouse.position = {};
    outhousesApi.addressLatLng(outhouse).then(function (addressResponse) {
      outhouse.position.lat = addressResponse.data.results[0].geometry.location.lat;
      outhouse.position.lng = addressResponse.data.results[0].geometry.location.lng;
        outhousesApi.createNew(outhouse).then(function (response) {
          console.log(response.config.data.outhouse);
          $scope.outhouses.push(response.config.data.outhouse)
          $rootScope.outhouse = {};
          $rootScope.rating=0;
          $rootScope.showForm = false;
          myMap.recenter(response.config.data.outhouse.position);
          $scope.addMarker(response.config.data.outhouse);
        })
    })
  }
  $scope.average = function(outhouse){
    var total=0;
    for (var i = 0; i < outhouse.ratings.length; i++) {
      total += outhouse.ratings[i].value
    }
    var averageRating = (total/i).toFixed(2);
    return averageRating;
  }

  $scope.checkRating = function (outhouse) {
    var rated = false;
    outhouse.ratings.forEach( function (rating) {
      if(rating.username == $rootScope.currentUser){
        rated = true;
        $scope.userRating = rating.value;
        return rated;
      }
    })
    return rated;
  }

  $scope.addRating = function(outhouse, rating){
    var value = parseInt(rating) || 3;
    outhouse.ratings.push({username: $rootScope.currentUser, value: value});
    outhousesApi.updateOuthouse(outhouse).then( function(response) {
      $scope.selectedOuthouse = outhouse;
     $scope.userRating = value;
     $scope.selectedOuthouse.average = $scope.average($scope.selectedOuthouse)
     $scope.totalRatings = $scope.selectedOuthouse.ratings.length;
     $scope.rated = true;

    })
  }
  $scope.starStringBulder = function (average) {
    var starString = '';
    var tempAverage = average;
    while(tempAverage>=1){
      starString+='<i class="fa fa-star"></i>'
      tempAverage-=1;
    }
    if(tempAverage>=0.5){
      starString+='<i class="fa fa-star-half-o"></i>'
    }
    return starString;
  }
  $scope.infoContent = function(outhouse){
    var infoString = '<div id="infoContent"><h3 class="marker-title">' + outhouse.title + '</h3>'+
    '<form ng-hide="rated||!currentUser">'+
    '<div class="stars2"><strong>Add your rating</strong><br>'+
    '<input class="star star-5" id="star-5" type="radio" ng-model="rating" name="star" value="5"/>'+
    '<label class="star star-5" for="star-5"></label>'+
    '<input class="star star-4" id="star-4" type="radio" ng-model="rating" name="star" value="4"/>'+
    '<label class="star star-4" for="star-4"></label>'+
    '<input class="star star-3" id="star-3" type="radio" ng-model="rating" name="star" value="3"/>'+
    '<label class="star star-3" for="star-3"></label>'+
    '<input class="star star-2" id="star-2" type="radio" ng-model="rating" name="star" value="2"/>'+
    '<label class="star star-2" for="star-2"></label>'+
    '<input class="star star-1" id="star-1" type="radio" ng-model="rating" name="star" value="1"/>'+
    '<label class="star star-1" for="star-1"></label><br>'+
    '</div><br><h4 class="submitLink" ng-click="addRating(selectedOuthouse, rating)">Submit</h4>'+
    '</form><br><h4>'+ $scope.starString + ' : {{totalRatings}} votes</h4>'+
    '<h4 ng-show="rated">You rated this {{userRating}} stars.</h4>'+
    '<br><h6><strong>' + outhouse.description + '</strong></h6></div>'
    return infoString;
  }


  $scope.markerWindows = function (marker, outhouse) {
    $scope.rated = $scope.checkRating(outhouse);

    google.maps.event.addListener(marker, 'click', function() {
      $scope.selectedOuthouse = outhouse;
      setTimeout(function() { myMap.map.panToWithOffset(marker.getPosition(), 0, -100); }, 300);
      $scope.rating=0;
      $scope.totalRatings = $scope.selectedOuthouse.ratings.length
      $scope.selectedOuthouse.average = $scope.average($scope.selectedOuthouse)
      $scope.starString = $scope.starStringBulder($scope.selectedOuthouse.average)
      $scope.rated = $scope.checkRating($scope.selectedOuthouse);
      if( prev_infowindow ) {
       prev_infowindow.close();
      }
      marker.info = new google.maps.InfoWindow();
        var content = $scope.infoContent(outhouse)
          var compiled = $compile(content)($scope);
            marker.info.setContent( compiled[0] );
      prev_infowindow = marker.info;
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

  $scope.getBackToMe = function () {
    $scope.loading = true;
    navigator.geolocation.getCurrentPosition(function(pos) {
      var newCenter = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
      myMap.recenter(newCenter);
      $scope.$apply(function() {
        $scope.loading = false;
      });
    });
  }

  $scope.findAnewCenter = function (location){
    $scope.loading = true;
    outhousesApi.newLoc(location).then(function (response) {
      console.log(response);
      myMap.recenter(response.data.results[0].geometry.location);
      $scope.adjustCenter = !$scope.adjustCenter;
      $scope.location='';
    });
  }

  $scope.logOut = function () {
    $scope.toggleMenu();
    $rootScope.logOut();
  }

  $scope.toggleLocForm = function () {
    $scope.toggleMenu();
    $scope.adjustCenter = !$scope.adjustCenter;
  }

  $scope.toggleMenu = function () {
    $scope.showMenu = !$scope.showMenu;
    $scope.adjustCenter = false;
    $rootScope.showForm = false;
  }

  $scope.toggleForm = function () {
    $scope.toggleMenu();
    $rootScope.showForm = !$rootScope.showForm;
    $scope.outhouse = {};
    var formDiv = document.getElementById('outhouseFormHolder');
    $compile(formDiv)($rootScope)
  }

  var prev_infowindow = false;
  var myMap = {};

  $rootScope.initMap = function () {
    myMap.init();
  }
  myMap.recenter = function(position){
    myMap.map.setCenter(position);
    console.log('center set');
    $scope.loading = false;
    console.log($scope.loading);
  }
  google.maps.Map.prototype.panToWithOffset = function(latlng, offsetX, offsetY) {
    var map = this;
    var ov = new google.maps.OverlayView();
    ov.onAdd = function() {
        var proj = this.getProjection();
        var aPoint = proj.fromLatLngToContainerPixel(latlng);
        aPoint.x = aPoint.x+offsetX;
        aPoint.y = aPoint.y+offsetY;
        map.panTo(proj.fromContainerPixelToLatLng(aPoint));
    };
    ov.draw = function() {};
    ov.setMap(this);
  };
  myMap.init = function() {
      var mapScope = this;
      prev_infowindow = false;
      $scope.loading = true;
      $scope.rated = false;
      $scope.adjustCenter = false;
      $rootScope.currentUser = false;
      $rootScope.currentUser = $cookies.get('user');
      $rootScope.showForm = false;
      this.mapEl = document.querySelector('#map')
      var formToggler = document.getElementById('form-toggler');
      formToggler.addEventListener('click', $scope.toggleForm);
      navigator.geolocation.getCurrentPosition(function(pos) {
        mapScope.initialize(pos.coords)
      })

      this.initialize = function (pos) {
        mapScope.currentLatLng = new google.maps.LatLng(pos.latitude, pos.longitude);
        mapScope.map = new google.maps.Map(mapScope.mapEl, {
          center: mapScope.currentLatLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        });

        $scope.loading = false;
        $scope.getOuthouses();
      }
    }
  myMap.init();
}])
