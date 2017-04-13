// Require the Blessed API.
var Blessed = require('blessed');
let moment = require('moment');
let _ = require('lodash');

let location = 'Independence';
let date = moment('03/01/1848','MM/DD/YYYY');
let temp = 'cold';
let miles = 0;

let pace = ['slow','steady','fast','grueling'];
let rations = ['meager','filling','generous'];
let health = ['very poor', 'poor', 'okay', 'good', 'great'];


let currentHealth = health[4];
let currentRations = rations[0];
let currentPace = pace[0];
let currentWeather = _.random(0,5);
let currentFood = 1600;

let journey = false;

// Initialize the screen widget.
var screen = Blessed.screen({
    // Example of optional settings:
    smartCSR: true,
    useBCE: true,
    log: `${__dirname}/application.log`,
    debug: true,
    dockBorders: false
});

// Specify the title of the application.
screen.title = 'Oregon Trail';

// Append the widget to the screen.
const dateLocationBox = Blessed.box({
    width:'100%',
    height:4,
    top: '0%+1',
    align: 'center',
    content: '',
    padding: 1,
    fg: '#ffffff',
    bg: '#000'
});

const locationField = Blessed.text({
    top: '0%',
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
    align: 'center',
    top: 5,
});

const healthStatusField = Blessed.text({
    content: `Health: ${currentHealth}`,
    top:0
});
const paceStatusField =Blessed.text({
    content: `Pace: ${currentPace}`,
    top: '0%+1'
});
const weatherStatusField = Blessed.text({
    content: `Weather: ${currentWeather}`,
    top: '0%+2'
});
const rationsStatusField = Blessed.text({
    content: `Rations: ${currentRations}`,
    top: '0%+3'
});

statusBox.append(weatherStatusField);
statusBox.append(healthStatusField);
statusBox.append(paceStatusField);
statusBox.append(rationsStatusField);

dateLocationBox.append(locationField);
dateLocationBox.append(dateField);


screen.append(dateLocationBox);
screen.append(statusBox);

screen.key(['p'],function(){
    "use strict";
    currentPace = shiftItems(pace);
    paceStatusField.setContent(`Pace: ${currentPace}`);
    screen.alloc();
    screen.title = 'change pace';
    screen.render();
});

screen.key(['r'],function(){
    "use strict";
    currentRations = shiftItems(rations);
    rationsStatusField.setContent(`Rations: ${currentRations}`);
    screen.alloc();
    screen.title = 'change pace';
    screen.render();
});
let resting = false;

let gameLoop = setInterval(()=>{
    if(journey) {
        "use strict";
        date.add(1, 'day');
        dateField.setContent(date.format('MMMM Do YYYY'));
        weatherStatusField.setContent(`Weather: ${currentWeather}`);
        if(!resting){
            miles+=(20 *(1 * 1)); //20 miles a day adjusted for number of oxen and pace
        }
         currentFood-=(5 * 2); //eat food subtract number of party members * rations amount

        statusBox.setLine(0,`Miles Traveled: ${miles} | Food Remaining: ${currentFood}`);
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

let inGameMenu = Blessed.box({
    width: '100%',
    height: '100%',
    content: 'some menu stuff',
    hidden: true,
    border: 'line'
});

let gameScreen = Blessed.box({
    width: '100%',
    height: '100%',
    content: 'gamescreen',
    hidden: true,
    border: 'line'
});

inGameMenu.key(['escape'],() =>{
    "use strict";
   inGameMenu.hide();

   screen.render();
});

screen.append(continueMenu);
screen.append(inGameMenu);

continueMenu.hide();

continueMenu.key(['enter'],() =>{
   journey = false;
   inGameMenu.setLabel(date.format('MMMM Do YYYY'));
   continueMenu.hide();
   inGameMenu.show();
   inGameMenu.insertBottom('press ESC to return');
   inGameMenu.focus();
    screen.render();
});


screen.key(['space'],function () {
    screen.debug("space was clicked");
    continueMenu.show();
    continueMenu.focus();
    journey = true;
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


