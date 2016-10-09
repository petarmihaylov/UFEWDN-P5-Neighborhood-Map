define(  ['config/firebase', 'config/googleMaps', 'models/location'],
function  (firebaseConfig,    googleMapsConfig,    Location) {
  'use stricst';

  // the viewmodels
  var ViewModel = function() {
    var self = this;

    var map;
    var apisLoaded = 0
    var firebaseDataLoaded = false;
    var mapsLoaded = false;

    // Initialize Firebase so we can get the data
    firebase.initializeApp(firebaseConfig.config);

    // Create a referance to the data so we can pull it
    const dbRefObjectLocations = firebase.database().ref().child('locations');

    // Determine how many locations are to be loaded
    self.numLocations = 0;

    // Set up the ko array so we can add the data
    self.locationList = ko.observableArray([]);


    // Function to show the content once all data has been loaded
    var showContent = function(firebaseDataLoadedState, mapsLoadedState) {
      firebaseDataLoaded = firebaseDataLoadedState;
      mapsLoaded = mapsLoadedState;
      console.log(firebaseDataLoaded);
      console.log(mapsLoaded);
      if ( firebaseDataLoaded && mapsLoaded) {
        $('.loader').fadeOut();
        $('.menu').fadeIn();
        $('#menu-trigger-label').fadeIn();
        $('.overlay').fadeOut();
        // $('.site-wrap').fadeIn();
        // $('.site-wrap').animate('opacity', 1);
      } else {
        console.log('The check condition failed..');
      }
    }

    var updateApiLoadedCount = function() {
      apisLoaded++;
    }

    dbRefObjectLocations.once('value', snap => {
      self.numLocations = snap.numChildren();

      // This runs async so I have to wait to make sure the data is there before
      // moving forward
      dbRefObjectLocations.on('child_added', snap => {
        self.locationList.push( new Location(snap.val()) );
        if (self.numLocations === self.locationList().length) {
          // firebaseDataLoaded = true;
          // showContent(firebaseDataLoaded, mapsLoaded);
          updateApiLoadedCount;
        }
      })

    })

    // Load the Map
    googleMapsConfig.initMap(map, updateApiLoadedCount);
    // googleMapsConfig.resize(map);

    (function wait() {
    if ( apisLoaded === 2 ) {
        showContent();
    } else {
        console.log('Keep waiting...');
        setTimeout( wait, 100 );
    }
})();

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
