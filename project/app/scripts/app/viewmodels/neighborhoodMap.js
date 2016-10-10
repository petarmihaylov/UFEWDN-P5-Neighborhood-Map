define(  ['config/firebase', 'models/location'],
function  (firebaseConfig,    Location) {
  'use stricst';

  // the viewmodels
  var ViewModel = function() {
    var self = this;

    var map;
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
    self.locationList = ko.observableArray([]);

    dbRefObjectLocations.once('value', snap => {
      self.numLocations = snap.numChildren();

      // This runs async so I have to wait to make sure the data is there before
      // moving forward
      dbRefObjectLocations.on('child_added', snap => {
        self.locationList.push( new Location(snap.val()) );
        if (self.numLocations === self.locationList().length) {
          // All locations are now loaded and the map can be initialized
          initMap();
        }
      })
    });

    // Load the Map as a self-executing anonymous function
    var initMap = function() {
      'use strict';
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 26.100365, lng: -80.399775},
        zoom: 13,
        mapTypeControl: true,
        mapTypeControlOptions: {
          style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: google.maps.ControlPosition.TOP_RIGHT
      }
      });

      // This event is fired only once when the map loads
      google.maps.event.addListenerOnce(map, 'tilesloaded', function() {
        // Update mapsLoaded to indicate that Google Maps has been Initialized
        showContent();
      });
    };

    // Function to show the content once all data has been loaded
    var showContent = function(firebaseDataLoadedState, mapsLoadedState) {
      $('.loader').fadeOut();
      $('.menu').fadeIn();
      $('#menu-trigger-label').fadeIn();
      $('.overlay').fadeOut();
    };

  };

  return ViewModel;


  // firebase.initializeApp(firebaseConfig.config);
  //
  // const dbRefObject = firebase.database().ref().child('locations');
  //
  // // Get the data from Firebase
  // var data = [];
  // dbRefObject.on('child_added', snap => {
  //   data.push(snap.val());
  //   // $('.locations-list').append($('<li class="location">').append(
  //   //   $('<a href="#">').text(snap.val().name)));
  // });
  //
  // console.log(data);
  //
  // // Load the Map
  // var map;
  // googleMapsConfig.initMap(map);

});
