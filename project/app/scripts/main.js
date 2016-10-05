$(function(){
  //
  // Load Firebase
  //
  const config = {
    apiKey: 'AIzaSyBWxSmaTUsN1eEsNXbNHzLm9Q6VT4bmlII',
    authDomain: 'udacity-maps-project-144315.firebaseapp.com',
    databaseURL: 'https://udacity-maps-project-144315.firebaseio.com',
    storageBucket: 'udacity-maps-project-144315.appspot.com',
    messagingSenderId: '94521799835'
  };
  // Initialize Firebase
  firebase.initializeApp(config);

  const dbRefObject = firebase.database().ref().child('locations');

  // Get the data from Firebase
  var data = [];
  dbRefObject.on('child_added', snap => {
    data.push(snap.val());
    // $('.locations-list').append($('<li class="location">').append(
    //   $('<a href="#">').text(snap.val().name)));
  });

  console.log(data);




  // Load the map
  var map;
  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 26.100365, lng: -80.399775},
      zoom: 13,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    });
  };

  // Initialize the map
  initMap();

});
