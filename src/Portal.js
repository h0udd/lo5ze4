import {GameOpject} from "./object/Hero/gameObject.js";
import {events} from "./Event.js";
import {Vector2} from "./vector2.js";
import {WALL_MODE} from "./helpers/wallMode.js";


export class Portal extends GameOpject {
  constructor(x, y, tiles=[], destination="ground_1"){
    super({
        position:new Vector2(x,y)
    });
    this.tiles = tiles
    this.destination = destination;
  
  }
  ready(){
      events.on("HERO_POSITION" ,  this  , pos => {
      //detect overlap...
      const roundedHeroX = Math.round(pos.x);
      const roundedHeroY = Math.round(pos.y);
      this.tiles.forEach(tile => {
       if(roundedHeroX === tile.x && roundedHeroY === tile.y){
        this.teleport();
       }
      })
      })
  }

  teleport(){
    console.log(`should teleport to ${this.destination}`);
    events.emit("CHANGE_LEVEL_REQUESTED",{name :this.destination});
  }

  drawImage(ctx, drawposX, drawposY){
    if (!WALL_MODE) return;
    this.tiles.forEach((tile) => {tile.draw(ctx, 'blue', 16)});
  }
  step(_delta) {
  //  this.tiles.forEach((tile) => {
      // here
   // }

  }
}
