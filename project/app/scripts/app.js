/* App Path Configuration */

// Author: Petar Mihaylov petarmihaylov.me

// Configure all the paths that we will require for the application.
requirejs.config({
    'baseUrl': 'scripts/lib',
    'paths': {
      'app': '../app',
      'modernizr': 'modernizr',
      'jquery': 'jquery',
      'knockout': 'knockout',
      'firebase': 'firebase',
      'firebase-config': '../app/config/firebase',
      'plugins': 'plugins',
      'googlemaps': '//maps.googleapis.com/maps/api/js?key=AIzaSyBWxSmaTUsN1eEsNXbNHzLm9Q6VT4bmlII',
      'googlemaps-config': '../app/config/googlemaps'
    }
});

console.log('scripts/app.js loaded')

// Load the main app module to start the app
requirejs(['app/main']);
