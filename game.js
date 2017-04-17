const locations = require('./locations');
const _ = require('lodash');
const Blessed = require('blessed');


const defaultPlayer = {
    yokes: 9,
    name: "Doug",
    family: ['jamie','shanna','carl','billy'],
    miles: 0,
    pace: 1, //slow .75, steady 1, fast 1.25, grueling 1.75
    rations: 1, //none 0, meager 0.25, filling 1, generous 1.5
    food: 1600,
    health: 3,
    clothes: 10,
    bullets: 100,
    axle: 1,
    wheel: 1,
    tongue: 1,
    hunger: 0
};

const ailments = [
    "has typhoid fever.",
    "has dysentery.",
    "has a broken leg",
    "has a broken arm",
    "has the flu",
    "has the heebie jeebies",
    "has oxen lust",
    "has the meat sweats"
]

class Game {
    constructor(options){
        this.player = defaultPlayer;

        process.on('hunger',this.hungerHandler);

        setInterval(() => {
            this.go();
            console.log('__________________________________________________\r\n');
        },1000);


    }

    sFact(num)
    {
    var rval=30;
    for (var i = 2; i <= num; i++)
        rval+= rval * (1 / num);
    return rval;
    }




    go(){
        this.updateFood();
        if(this.player.hunger > 100){
            console.log("You have died\r");
            process.exit(0);
        }
        let yokes = this.player.yokes;
        this.randomizeEvent();
        let adjustedPace = parseInt(this.sFact(yokes) * this.player.pace);
        this.player.miles+=adjustedPace;
        if(locations.Oregon.distance - this.player.miles < 0){
            console.log("You have arrived at your destination:\n\rDumping stats:\rn", JSON.stringify(this.player,null,2));
        }
        console.log(`mile to next destination : ${locations.Oregon.distance - this.player.miles}\r`);
        console.log(this.player.food,this.player.hunger);
    };


    updateFood(){
        let familySize = this.player.family.length + 1;
        let dailyIntake = ((familySize * 3) * this.player.rations);
        this.player.food-=dailyIntake;
        if(this.player.food < dailyIntake){
            process.emit('hunger');
        }
    }

    hungerHandler(){
        defaultPlayer.hunger += (defaultPlayer.family.length + 1);
        if(defaultPlayer.hunger > 0){
            console.log('You are hungry.\r');
        }
    }


    stop(){

    }

    randomizeAilment(person){
        let ailment = ailments[_.random(0,ailments.length-1)];
        console.log(person + ' ' + ailment);
    }

    randomizeEvent(){
        let roll20 = _.random(1,20);
        let event = true; //assume there will always be an event;
        switch (roll20) {
            case 1:
                console.log('you rolled a one, oxen died\r');
                this.player.yokes-=0.5;
                break;
            case 4:
                console.log('you rolled a 4\r');
                this.player.clothes -= 1;
                break;
            case 5:
                let familyMember = this.player.family[_.random(0,this.player.family.length - 1)];
                this.randomizeAilment(familyMember);
                break;
            case 6:
                this.randomizeAilment(this.player.name);
                break;
            case 14:
                let member = this.player.family.splice(_.random(0,this.player.family.length - 1),1);
                console.log(member + ' has died.\r');
                break;
            case 20:
                this.player.food += 100;
                break;
            default:
                event = false;
        }
        return this.player;
    }


}



module.exports = new Game();