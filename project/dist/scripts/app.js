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
    // Execution is initated automatically
    // No need to do anthing here
},

function (err) {
  //The errback, error callback
  //The error has a list of modules that failed
  var failedId = err.requireModules && err.requireModules[0];
  if (failedId.indexOf('google') !== -1) {
    if(alert('Google Maps API failed to load.\n\nPlease try reloading the page.\n\n Click \'OK\' to try to reload the page.')){}
    else window.location.reload();
  } else if (failedId.indexOf('firebase') !== -1) {
    if(alert('Firebase API failed to load.\n\nPlease try reloading the page.\n\n Click \'OK\' to try to reload the page.')){}
    else window.location.reload();
  } else {
    if(alert('Something went wrong:\n\n' + err.requireModules + '\n\nPlease try reloading the page.\n\n Click \'OK\' to try to reload the page.')){}
    else window.location.reload();
  }
});
