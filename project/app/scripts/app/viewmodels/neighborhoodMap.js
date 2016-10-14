define(  ['config/firebase', 'models/location'],
function  (firebaseConfig,    Location) {
  'use stricst';

  // the viewmodels
  var ViewModel = function() {
    var self = this;

    var map;
    var markers = [];
    // Create the infoWindow object
    var largeInfowindow = new google.maps.InfoWindow();

    var apisLoaded = 0
    var loadingFirabaseData = new $.Deferred();
    var loadingMaps = new $.Deferred();

    // Initialize Firebase so we can get the data
    firebase.initializeApp(firebaseConfig.config);

    // Create a referance to the data so we can pull it
    const dbRefObjectLocations = firebase.database().ref().child('locations');

    // Determine how many locations are to be loaded
    self.numLocations = 0;

    // Set up the ko array so we can add the data
    self.initialLocationList = []
    self.locationList = ko.observableArray([]);

    dbRefObjectLocations.once('value', snap => {
      self.numLocations = snap.numChildren();

      // This runs async so I have to wait to make sure the data is there before
      // moving forward
      dbRefObjectLocations.on('child_added', snap => {
        self.locationList.push( snap.val() );
        if (self.numLocations === self.locationList().length) {
          // All locations are now loaded and the map can be initialized

          self.initialLocationList.forEach(function(location) {
            self.locationList.push( new Location(location) );
          });

          initMap();
        }
      })
    });

    // Load the Map as a self-executing anonymous function
    function initMap() {
      'use strict';
      map = new google.maps.Map(document.getElementById('map'), {
        center: {'lat': 26.100365, 'lng': -80.399775},
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
        }
      });

      for (var i = 0; i < self.locationList().length; i++) {
        // Get the position from the location array.
        //console.log('name: ' + self.locationList()[i].name);
        //console.log('latlong: ' + self.locationList()[i].latlong);

        var latlong = self.locationList()[i].latlong;
        var name = self.locationList()[i].name;
        // Create a marker per location, and put into markers array.
         var marker = new google.maps.Marker({
          position: latlong,
          title: name,
          animation: google.maps.Animation.DROP,
          id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        // console.log(marker);
        marker.addListener('click', function() {
          populateInfoWindow(this, largeInfowindow);
        });
      }

      // This event is fired only once when the map loads
      google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        // Update mapsLoaded to indicate that Google Maps has been Initialized
        showContent();
        showLocations();
      });
    };

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {

        // Turn off all aninations
        markers.forEach( function(marker) {
          marker.setAnimation(null);
        });

        // Set the amination for the marker of the clicked location
        marker.setAnimation(google.maps.Animation.BOUNCE);

        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
          infowindow.marker = null;

          // Stop the animation when the infowindow is closed
          marker.setAnimation(null);
        });
      }
    }

    // This function will loop through the markers array and display them all.
    function showLocations() {
      var bounds = new google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
      }
      map.fitBounds(bounds);
    };

    // Function to show the content once all data has been loaded
    function showContent(firebaseDataLoadedState, mapsLoadedState) {
      $('.loader').fadeOut();
      $('.menu').fadeIn();
      $('#menu-trigger-label').fadeIn();
      $('.overlay').fadeOut();
    };

    self.changeLocation = function(clickedLocation) {
      markers.forEach(function(marker) {
        if (marker.title === clickedLocation.name) {
          populateInfoWindow(marker, largeInfowindow);
        }
      })
    };

  };

  return ViewModel;

});
