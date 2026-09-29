export function moveTowards(person,DestinationPosition ,speed){
    let distanceToTravelX = DestinationPosition.x - person.position.x;
    let distanceToTravelY = DestinationPosition.y - person.position.y;
    let distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

    if(distance <= speed) {
        //if we're close enough just move directly to the destination 
        person.position.x = DestinationPosition.x;
        person.position.y = DestinationPosition.y; 
    }
    else {
        //dtherwise, move by the specifide speed in the direction of the destination 
    let normalizedX = distanceToTravelX / distance ;
    let normalizedY = distanceToTravelY / distance ;
  
    person.position.x += normalizedX * speed;
    person.position.y += normalizedY * speed ;

    //recalculate remaining distance after the move 
    distanceToTravelX = DestinationPosition.x - person.position.x;
    distanceToTravelY = DestinationPosition.y - person.position.y;
    distance = Math.sqrt(distanceToTravelX**2 + distanceToTravelY**2);

    }
    return distance;
}