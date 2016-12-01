/* Location Model */

// Author: Petar Mihaylov petarmihaylov.me

define('Loc', function() {
    'use strict';

    // Represents a single location
    function Loc(location) {
      this.address = ko.observable(location.address);
      this.latlong = ko.observable(location.latlong);
      this.name = ko.observable(location.name);
      this.whyLoveIt = ko.observable(location.whyLoveIt);
    }

    return Location;

  });
