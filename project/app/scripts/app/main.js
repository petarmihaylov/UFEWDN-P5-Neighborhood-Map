/* Google Maps javaScript API Configuration */

// Author: Petar Mihaylov petarmihaylov.me

define(  ['config/firebase', 'config/googleMaps'],
function  (firebaseConfig, googleMapsConfig) {
  firebase.initializeApp(firebaseConfig.config);

  const dbRefObject = firebase.database().ref().child('locations');

  // Get the data from Firebase
  var data = [];
  dbRefObject.on('child_added', snap => {
    data.push(snap.val());
    // $('.locations-list').append($('<li class="location">').append(
    //   $('<a href="#">').text(snap.val().name)));
  });

  // Load the Map
  var map;
  googleMapsConfig.initMap(map);
});
