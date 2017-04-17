// Require the Blessed API.
var Blessed = require('blessed');

// Initialize the screen widget.
var screen = Blessed.screen({
    // Example of optional settings
});

const mainMenu = require('./main-menu')(screen);


// Render the screen.
screen.render();
// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['C-c'], function(ch, key) {
    process.exit(0);
});


