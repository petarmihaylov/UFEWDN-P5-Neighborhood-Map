/* Google Maps javaScript API Configuration */

// Author: Petar Mihaylov petarmihaylov.me

define({
  initMap: function(map, updateApiLoadedCount) {
    'use strict';
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 26.100365, lng: -80.399775},
      zoom: 13,
      mapTypeControl: true,
      mapTypeControlOptions: {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    });

    // This event is fired only once when the map loads
    google.maps.event.addListenerOnce(map, 'idle', function() {
      // Update mapsLoaded to indicate that Google Maps has been Initialized
      // mapsLoadedState = true;
      // console.log('Map is fully loaded');
      // console.log(mapsLoadedState);
      // showContent(firebaseDataLoadedState, mapsLoadedState);
      updateApiLoadedCount();
    });

  },
  //
  // resize: function(map) {
  //   google.maps.event.trigger(map, 'resize');
  //   console.log('The resize event for the map was triggered');
  // }
});
