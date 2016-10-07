/* Google Maps javaScript API Configuration */

// Author: Petar Mihaylov petarmihaylov.me

requirejs.config({
  'baseUrl': 'scripts',
  'paths': {
    'app': 'app'
  }
});

// Load the main app module to start the app
requirejs(['app/main']);
