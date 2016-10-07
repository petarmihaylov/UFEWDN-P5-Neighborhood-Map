requirejs.config({
  'baseUrl': 'scripts',
  'paths': {
    'app': 'app',
    //'firebaseConfig': 'app/config/firebase'
  }
});

// Load the main app module to start the app
requirejs([app/main]);
