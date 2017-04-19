
import locations from './locations';
import _ from 'lodash';


const defaultPlayer = {
    yokes: 4,
    name: "Doug",
    family: ['jamie', 'shanna', 'carl', 'billy'],
    miles: 0,
    pace: 1.25, //slow .75, steady 1, fast 1.25, grueling 1.75
    rations: 1.5, //none 0, meager 0.25, filling 1, generous 1.5
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
];

class Game {
    constructor(options) {
        this.player = defaultPlayer;
        this.player.locations = locations;

        process.on('player:hunger', () => {
            this.hungerHandler();
        })
        ;
        process.on('player:death', () => {
            this.deathHandler();
        });
        process.on('player:arrived', () => {
            this.arriveHandler();
        });

        process.on('player:continue',() =>{
            this.interval = setInterval(()=>{
                this.go();
            },10);
        });

        process.on('player:pause',()=>{
            this.stop();
        })


    }

    arriveHandler(location) {
        //console.log(this.locations.destination.type);
        return location;
    }

    deathHandler() {
        // console.log("Would you like to write an epitaph?");
        const message = 'You have died.';
        process.emit('player:notify',{message});
    }

    hungerHandler() {
        this.player.hunger += (this.player.family.length + 1);
        if (this.player.hunger > 0) {
        }
        return this.player;
    }


    sFact(num) {
        let rval = 5;
        for (let i = 2; i <= num; i++)
            rval += rval * (1 / num);
        return num === 0 ? 0 : rval;
    }


    travel() {
        process.emit('player:travel',this.player);
        let yokes = this.player.yokes;
        //this.randomizeEvent();
        let adjustedPace = this.sFact(yokes) * this.player.pace;
        this.player.miles += adjustedPace;
        if (this.player.miles >= this.player.locations.destination.distance) {
            this.player.locations.setDestination();
            process.emit('player:arrived', this.player.locations.destination);
            process.emit('player:pause');
        }
    }

    go() {
        this.updateFood();
        this.randomizeEvent();
        this.travel();

        if (this.player.locations.destination.type === 'end') {
            process.emit('player:notify',{message: 'You have reached oregon'});
            process.emit('player:finish');
        }


    }
    ;


    updateFood() {
        if (this.player.hunger > 100) {

            process.emit("player:death", this.player);
        }
        let familySize = this.player.family.length + 1;
        let dailyIntake = ((familySize * 3) * this.player.rations);
        this.player.food -= dailyIntake;
        if (this.player.food < dailyIntake || this.player.rations == 0) {
            process.emit('player:hunger', this.player);
        }
    }


    stop() {
        clearInterval(this.interval);
    }

    randomizeAilment(person) {
        const ailment = ailments[_.random(0, ailments.length - 1)];
        const message = `${person} ${ailment}`;
        process.emit('player:notify',{message});
    }

    randomizeEvent() {
        let roll20 = _.random(1, 20);
        let event = true; //assume there will always be an event;
        switch (roll20) {
            case 1:
                if (this.player.yokes > 1) {
                    this.player.yokes -= 0.5;
                }
                break;
            case 4:
                this.player.clothes -= 1;
                break;
            case 5:
                if (this.player.family.length > 0) {
                    let familyMember = this.player.family[_.random(0, this.player.family.length - 1)];
                    this.randomizeAilment(familyMember);
                }
                break;
            case 6:
                this.randomizeAilment(this.player.name);
                break;
            case 14:
                if (this.player.family.length > 0) {
                    let member = this.player.family.splice(_.random(0, this.player.family.length - 1), 1);
                }
                break;
            case 20:
                //this.player.food += 100;
                break;
            default:
                event = false;
        }
        return this.player;
    }


}


export default new Game();