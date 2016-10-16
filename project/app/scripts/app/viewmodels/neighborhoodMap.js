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
    self.filter = ko.observable();

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

      // Builds the markers list
      buildMarkersList(self.filteredItems());

      // This event is fired only once when the map loads
      google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        // Update mapsLoaded to indicate that Google Maps has been Initialized
        showContent();
        showLocations();
      });
    }; // END: initMap();

    function buildMarkersList(listArray) {
      markers = [];
      for (var i = 0; i < listArray.length; i++) {
        // Get the position from the location array.
        // console.log('name: ' + self.locationList()[i].name);
        // console.log('latlong: ' + self.locationList()[i].latlong);

        var latlong = listArray[i].latlong;
        var name = listArray[i].name;
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
    }

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
      };
    };

    // This function will loop through the markers array and display them all.
    function showLocations() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    };

    // This function will loop through the listings and hide them all.
    function hideLocations() {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
    };

    // Updates the list of markers to be seen
    function updateMarkersList(listArray) {
      hideLocations();
      buildMarkersList(listArray);
      showLocations();
    }

    // Function to show the content once all data has been loaded
    function showContent() {
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
    }; // END: self.changeLocation

    // ko.utils.arrayFilter - filter the locations using the location Name
    self.filteredItems = ko.computed(function() {
      var filter = self.filter();

      // Straigh from the knockoutjs.debug.js source code as this function
      // is not included in the minified version
      function stringStartsWith(string, startsWith) {
          string = string || '';
          if (startsWith.length > string.length)
              return false;
          return string.substring(0, startsWith.length) === startsWith;
      };

      if (!filter) {
        // Only return the array if it has been fully built with all location points
        if (self.locationList().length === self.numLocations ) {
          // This runs only when the filter is undefined (aka: there is nothing entered in the 'Search for...' box)
          //updateMarkersList(self.locationList());
          //return self.locationList();
          var filtered = ko.utils.arrayFilter(self.locationList(), function(location) {
            return location.name
          });

          updateMarkersList(filtered);

          return filtered;
        }
      } else {
        var filtered = ko.utils.arrayFilter(self.locationList(), function(location) {
          // Convert both the filter string and the name of the location to lowercase
          // so that the search will only care about the order of the letters and not
          // capitalization
          return stringStartsWith(location.name.toLowerCase(), filter.toLowerCase());
        });

        updateMarkersList(filtered);
        return filtered;
      };
    }); // END: self.filteredItems

  };

  return ViewModel;

});
