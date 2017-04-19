import _ from 'lodash';

class Location{
    constructor(options){
        this.name = options.name;
        this.distance = options.distance;
        this.type = options.type;
    }
}

class LocationService{


    constructor(options){
        this.locations = _(_.map(options,config => {
            const location =  new Location(config);
            return location;
        }));
        this.setDestination();
    }

    getLocations(){
        return this.locations;
    }


    setDestination(){
        const nextDest =this.locations.next();
        if(!nextDest.done){
            this.destination = nextDest.value;
            process.emit('location:changed');
        }

    }
}

let mockedLocations = [];

for(let i =0; i <= 50; i++){
    mockedLocations.push(
        {
            name: "",
            distance:  _.random(0,40) * i,
            type: "town"
        }
    )
}

mockedLocations = _.uniqBy(mockedLocations.sort((a, b) => {
    return a.distance - b.distance;
}),c => {
    c.name = `Waypoint ${c.distance}`;
    return c.distance;
});

mockedLocations[mockedLocations.length - 1].type = 'end';



export default new LocationService(mockedLocations);