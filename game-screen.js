import Blessed from 'blessed';

const gameScreenModule = (screen) => {

    const gameScreen = Blessed.box({
        tags: true,
        width: '100%',
        height: '100%',
        border: 'line',
        label: 'The Oregon Trail (c)'
    });
    screen.on('player:travel', (data) => {
        gameScreen.show();
        gameScreen.setContent(`
        Date: null\n
        Weather: null\n
        Health: ${data.health}\n
        Food: ${data.food}\n
        Next Landmark: ${data.locations.destination.name}\n
        Miles Traveled: ${data.miles}\n
        `);
        screen.render();
    });

    gameScreen.key('enter',() =>{
        //todo load in game menu
    });

    return gameScreen;

};

export default gameScreenModule;