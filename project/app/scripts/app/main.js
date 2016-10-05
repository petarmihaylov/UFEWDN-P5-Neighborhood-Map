/* Main App */

// Author: Petar Mihaylov petarmihaylov.me

define(['modernizr', 'plugins', 'jquery', 'knockout',
        'firebase', 'firebase-config',
        'googlemaps', 'googlemaps-config'

], function(modernizr, plugins, $, ko, firebase, firebaseConfig, google, googleMapsConfig) {
  'use strict';

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig.config);

  const dbRefObject = firebase.database().ref().child('locations');

  // Get the data from Firebase
  dbRefObject.on('child_added', snap => {
    data.push(snap.val());
    // $('.locations-list').append($('<li class="location">').append(
    //   $('<a href="#">').text(snap.val().name)));
  });

  // Initialize the map
  googleMapsConfig.initMap();
});
