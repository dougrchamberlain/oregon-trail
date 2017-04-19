
import Blessed from 'blessed';
import game from './game';

let interval;

function mainMenuModule(screen){
    const commands = {
        1() {
           process.emit('player:continue');
        },
        'q'() {
            clearInterval(interval);
            const exitQuestion = Blessed.question({
                label: "Exit Game?",
                content: "Are you sure you want to quit?",
                top: 'center',
                left: 'center',
                width: '50%',
                height: '50%',
                border: 'line',
                padding:1,
            });

            mainMenu.append(exitQuestion);
            exitQuestion.setFront();
            screen.render();

            exitQuestion.ask("Are you sure you want to quit?",(arg1, result, arg2) => {
                if(result === true){
                    process.exit(0);
                }
                else{
                    //todo emit continue event
                    commands[1]();
                }
            });
        }
    };


    const mainMenu = Blessed.form({
        content: "{center}{bold}The Oregon Trail{/bold}{/center}\n" +
        "{left}You may:{/left}\n" +
        "{center}1. Travel the Trail{/center}\n\n\n\n\n\n\n",
        tags: true,
        width:'100%',
        height: '100%',
        border: 'line',
        label: 'The Oregon Trail (c)'

    });


    const input = Blessed.textbox({
        bottom: 0,
        left: 21,
        width: 'shrink',
        height: 'shrink',
        name: 'option',
        inputOnFocus: true,
        fg: 'black',
        bg: 'white'
    });

    //attach children
    mainMenu.append(input);


    mainMenu.key([1,2,3,4,5,6,7,'q'],option => {
        input.setValue(option);
        screen.render();
    });

    input.key('enter',() => {
        commands[input.getValue()]();
        screen.render();
    });

    mainMenu.on('element keypress',(el, ch, key) => {
        if(key.full === 'C-c'){
            process.exit(0);
        }
    });

    return mainMenu;
}

export default mainMenuModule;