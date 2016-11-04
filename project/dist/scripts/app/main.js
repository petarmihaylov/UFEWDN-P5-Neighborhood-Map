/* Main App */

// Author: Petar Mihaylov petarmihaylov.me

define(  ['app/viewmodels/neighborhoodMap'],
function  (NeighborhoodMapViewModel) {
  'use stricst';

  // bind a new instance of our NeighborhoodViewModel to the page
  ko.applyBindings(new NeighborhoodMapViewModel());
});
