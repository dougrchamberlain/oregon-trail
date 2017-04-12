// Require the Blessed API.
var Blessed = require('blessed');
let moment = require('moment');

let location = 'Independence';
let date = moment('03/01/1848','MM/DD/YYYY');
let temp = 'cold';
let health = 'good';
let hunger = 0;
let miles = 0;



let pace = ['slow','steady','fast','grueling'];
let rations = ['meager','filling','generous'];

let currentRations = rations[0];
let currentPace = pace[0];

let journey = false;

let statusContent = `Weather: ${temp}\n` +
    `Health: ${health}\n` +
    `Pace: ${currentPace}\n` +
    `Rations: ${currentRations}`;

// Initialize the screen widget.
var screen = Blessed.screen({
    // Example of optional settings:
    smartCSR: true,
    useBCE: true,
    log: `${__dirname}/application.log`,
    debug: true,
    dockBorders: true
});

// Specify the title of the application.
screen.title = 'Oregon Trail';

// Append the widget to the screen.
const dateLocationBox = Blessed.box({
    width:'100%',
    height:4,
    align: 'center',
    content: '',
    padding: 1,
    fg: '#ffffff',
    bg: '#000'
});

const locationField = Blessed.text({
    top: 'top',
    left: 'center',
    content: location,
    align: 'center',
    fg: '#ffffff',
    bg: '#000'
});

const dateField = Blessed.text({
    bottom: 0,
    left: 'center',
  content: date.format('MMMM Do YYYY'),
    align: 'center',
    fg: '#ffffff',
    bg: '#000'
});

const statusBox = Blessed.box({
    height: 6,
    width: '75%',
    left: 'center',
    padding:1,
    fg: '#000',
    bg: '#fff',
    content: statusContent
    ,
    align: 'center',
    top: 5,
});


dateLocationBox.append(locationField);
dateLocationBox.append(dateField);


screen.append(dateLocationBox);
screen.append(statusBox);

screen.key(['p'],function(){
    "use strict";
    currentPace = shiftItems(pace);
    statusBox.setLine(2,`Pace: ${currentPace}`);
    screen.alloc();
    screen.title = 'change pace';
    screen.render();
});

screen.key(['r'],function(){
    "use strict";
    currentRations = shiftItems(rations);
    statusBox.setLine(3,`Rations: ${currentRations}`);
    screen.alloc();
    screen.title = 'change pace';
    screen.render();
});

let gameLoop = setInterval(()=>{
    if(journey) {
        "use strict";
        date.add(1, 'day');
        dateField.setContent(date.format('MMMM Do YYYY'));
    }
    screen.render();
},1000);

let continueMenu = Blessed.box({
    height: 1,
    width: '75%',
    left: 'center',
    content: "{bold}Press ENTER to size up the situation.{/bold}",
    align: 'center',
    bottom: 0,
    tags: true
});
screen.append(continueMenu);
continueMenu.hide();

continueMenu.key(['enter'],() =>{
   journey = false;
   continueMenu.hide();
   //clearInterval(gameLoop);
    screen.render();
});


screen.key(['space'],function () {
    continueMenu.show();
    continueMenu.focus();

        //eat();
        //updateHealth();
        //checkforWayPoint();
        journey = true;
        gameLoop;

});


function shiftItems(arr)
{
    let tmp = arr[0];
    for (i = 1; i < arr.length; i++)
        arr[i - 1] = arr[i];
    arr[arr.length - 1] = tmp;
    return arr[0];
}

// Render the screen.
screen.render();
// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['q', 'C-c'], function(ch, key) {
    process.exit(0);
});


