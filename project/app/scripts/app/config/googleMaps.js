/* Google Maps javaScript API Configuration */

// Author: Petar Mihaylov petarmihaylov.me

define({
  initMap: function(map) {
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
  }
});
