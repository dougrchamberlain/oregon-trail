// Require the Blessed API.
import Blessed from 'blessed';
import MainMenu from './main-menu';
import GameScreen from './game-screen';

// Initialize the screen widget.
const screen = Blessed.screen({
    // Example of optional settings
});


const mainMenu = MainMenu(screen);
const gameScreen = GameScreen(screen);

screen.append(mainMenu);
screen.append(gameScreen);
gameScreen.hide();

mainMenu.focusNext();
mainMenu.show();
screen.render();


process.on(['player:travel'],(data) => {
    screen.emit('player:travel',data);
    screen.render();
});

process.on('player:notify',(data) => {
    process.emit('player:pause');
    const messageBox = Blessed.message({
        top: 'center',
        left: 'center',
        height: 5,
        width: 'shrink',
        border: 'line',
        tags: true,
        valign: 'middle'

    });

    messageBox.display(`{bold}${data.message}{/bold}`,0,(result) =>{
        "use strict";
        messageBox.destroy();
        process.emit('player:continue');

    });
    screen.append(messageBox);
    messageBox.show();
    screen.render();
});


// Render the screen.
screen.render();
// Quit on `q`, or `Control-C` when the focus is on the screen.
screen.key(['C-c'], (ch, key) => {
    process.exit(0);
});
