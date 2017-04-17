const Blessed = require('blessed');
const options = require('./options');
const game = require('./game');



function mainMenuModule(screen){
    "use strict";

    const commands = {
        1: function () {
            "use strict";
            game.init(options);
        },
        'q': function() {
            "use strict";
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

            exitQuestion.ask("Are you sure you want to quit?",function(arg1,result,arg2){
               if(result){
                   process.exit(0);
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



    mainMenu.key([1,2,3,4,5,6,7,'q'],function(option){
        input.setValue(option);
        screen.render();
    });

    input.key('enter',function(){
        "use strict";
        commands[input.getValue()]();
        screen.render();
    });

    mainMenu.on('element keypress',function(el,ch,key){
        if(key.full === 'C-c'){
            process.exit(0);
        }
    });


    screen.append(mainMenu);
    input.focus();
    screen.render();

    return mainMenu;

}

module.exports = mainMenuModule;