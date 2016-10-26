define(  ['config/firebase', 'config/foursquare', 'models/location'],
function  (firebaseConfig,    foursquareConfig,    Location) {
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

    // Fousquare API
    var fsBaseUrl = 'https://api.foursquare.com/v2/'
    var fsId = foursquareConfig.config.id;
    var fsSecret = foursquareConfig.config.secret;

    // Get Foursquare content
    function getFoursquareVenuePhotos(fsVenueId, marker) {
      var fsService = 'venues/';
      var fsUrl = fsBaseUrl + fsService + fsVenueId + '/photos/?' + $.param({
        'client_id': fsId,
        'client_secret': fsSecret,
        'v': 20161001,
        'limit': 5
      });

      $.getJSON(fsUrl, function(data) {
      }).done(function(data){
        var photoUrls = [];

        $.each( data.response.photos.items, function( key, photo ) {
          photoUrls.push(
            // photo.prefix + photo.width + 'x' + photo.height + photo.suffix); // Original photo size
            // photo.prefix + 'width100' + photo.suffix); // Proportionately saled based on width
            '<a href="' + photo.prefix + 'original' + photo.suffix + '">' +
            '<img src="' + photo.prefix + 'height100' + photo.suffix+ '"></a>'); // Proportionately saled based on height
        });

        populateInfoWindow(marker, largeInfowindow, photoUrls);

      }).fail(function(){
        // If the search fails, display an alert
        alert('Unable to pull images from Foursquare');
      });;
    };

    function getFoursquareData(latlong, name, marker) {
      var fsVenueId;
      var fsService = 'venues/search/?'
      var fsUrl = fsBaseUrl + fsService + $.param({
        'client_id': fsId,
        'client_secret': fsSecret,
        'v': 20161001,
        'll': latlong,
        'intent': 'match',
        'query': name
      });

      $.getJSON(fsUrl, function (data) {
      }).done(function(data){
        fsVenueId = data.response.venues[0].id;
        // Once I have the ID i should call the other function to get the photos
        getFoursquareVenuePhotos(fsVenueId, marker)
      }).fail(function(){
        // If the search fails, display an alert
        alert('Unable to pull images from Foursquare');
      });
    }

    //getFoursquareData('26.097036,-80.384446', 'ultimate software');

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
        var address = listArray[i].address;
        var whyLoveIt = listArray[i].whyLoveIt;

        var contentString = '<div>' +
        '<h3>' + name + '</h3>' +
        '<p><strong>Address</strong><br />' + address +'</p>' +
        '<p><strong>Why shoould you love it?</strong><br />' + whyLoveIt + '</p>' +
        '<div>'

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
          position: latlong,
          title: name,
          content: contentString,
          animation: google.maps.Animation.DROP,
          id: i,
          numImages: 0
        });
        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        // console.log(marker);
        marker.addListener('click', function() {
          // populateInfoWindow(this, largeInfowindow);
          // Note: In this context this = 'clicked marker'
          getFoursquareData(this.position.lat() + ',' + this.position.lng(),this.title, this);

        });
      }
    }

    // This function populates the infowindow when the marker is clicked. We'll only allow
    // one infowindow which will open at the marker that is clicked, and populate based
    // on that markers position.
    function populateInfoWindow(marker, infowindow, photoUrls) {
      // Check to make sure the infowindow is not already opened on this marker.
      if (infowindow.marker != marker) {
        // Turn off the amination for the curent infowindow marker
        if (infowindow.marker != null) {
          infowindow.marker.setAnimation(null);
        }

        // Only do this if the photoUrls array is not empty
        if (photoUrls.length != 0) {
          marker.content += '<div class="foursquare-images">';
          marker.content += '<p><strong>Location Photos</strong><br />'
          // Only fo this if no images have been added to this marker yet
          if ( marker.numImages  == 0 ) {
            photoUrls.forEach(function(photo) {
              marker.content += photo;
              marker.numImages++;
            });
            marker.content += '<br /><h7>Images provided by Foursquare.</h7>'
          } else {
            console.log('Images already pulled. Skipping...');
          }
        } else {
          console.log('No images were returned for this location');
        }
        marker.content += '</p>'
        marker.content += '</div>';

        // Set the amination for the marker of the clicked location
        marker.setAnimation(google.maps.Animation.BOUNCE);

        infowindow.marker = marker;
        infowindow.setContent(marker.content);
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

    // Function to show the content once all data has been loaded
    function showContent() {
      $('.loader').fadeOut();
      $('.menu').fadeIn();
      $('#menu-trigger-label').fadeIn();
      $('.overlay').fadeOut();
    };

    // This runs when a new location is selected from the menu
    self.changeLocation = function(clickedLocation) {
      // Sets changes which infoWindow is open.
      markers.forEach(function(marker) {
        if (marker.title === clickedLocation.name) {
          // populateInfoWindow(marker, largeInfowindow);
          getFoursquareData(marker.position.lat() + ',' + marker.position.lng(),marker.title, marker);
        }
      });

      // When the visible map is smaller than 700px, this also closes the side menu when a selection is mapsLoaded
      // console.log($('#map > div > div > div:nth-child(1) > div:nth-child(3)').width());
      if ($('#map > div > div > div:nth-child(1) > div:nth-child(3)').width() < 700 ) {
        $('#menu-trigger').prop('checked', false);
      }
    }; // END: self.changeLocation

    // Adds an event listener to clear the filter
    self.clearFilter = function() {
      $('.filter-text').val('');
      self.filter('');
    }



  }; // END: ViewModel

  return ViewModel;

});