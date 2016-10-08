define(  ['config/firebase', 'config/googleMaps', 'models/location'],
function  (firebaseConfig,    googleMapsConfig,    Location) {
  'use stricst';

  // the viewmodels
  var ViewModel = function() {
    var self = this;

    // Initialize Firebase so we can get the data
    firebase.initializeApp(firebaseConfig.config);

    // Create a referance to the data so we can pull it
    const dbRefObjectLocations = firebase.database().ref().child('locations');

    // Set up the ko array so we can add the data
    self.locationList = ko.observableArray([]);

    // This runs async so I have to wait to make sure the data is there before
    // moving forward
    dbRefObjectLocations.on('child_added', snap => {
      console.log(snap);
      self.locationList.push( new Location(snap.val()) );
    })

    console.log(self.locationList());

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
