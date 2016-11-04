/* Google Maps javaScript API Configuration */

// Author: Petar Mihaylov petarmihaylov.me

requirejs.config({
  'baseUrl': 'scripts',
  'paths': {
    'app': 'app'
  }
});

// Load the main app module to start the app
requirejs(['app/main'], function () {
    //Do something with $ here
},

function (err) {
  //The errback, error callback
  //The error has a list of modules that failed
  var failedId = err.requireModules && err.requireModules[0];
  if (failedId.indexOf('google') !== -1) {
    alert('Google Maps API failed to load. Please try reloading the page.');
  } else if (failedId.indexOf('firebase') !== -1) {
    alert('Firebase API failed to load. Please try reloading the page.');
  } else {
    alert('Something went wrong: ' + err.requireModules + ' Please try reloading the page.');
  }
});
