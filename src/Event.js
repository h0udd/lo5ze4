 class  Events {
    callbacks =[]; 
    nextId = 0; 

 //{ id: 2, eventName:"HERO_PICKS_UP_ITEM",  caller:"Hero",   callback: [Function] },

 emit (eventName , value) {
    this.callbacks.forEach(stored => {
       if(stored.eventName === eventName){
        stored.callback(value)
       } 
    })
 } 
on (eventName, caller , callback){
    this.nextId +=1;
    this.callbacks.push({
        id:this.nextId,
        eventName,
        caller,
        callback,
    });
    return this.nextId;
}

off(id){
    this.callbacks = this.callbacks.filter((stored) => stored.id !== id );
}

unsubscribe (caller){
    this.callbacks = this.callbacks.filter(
        (stored) => stored.caller !== caller,
    );
}
}
export const events = new Events();