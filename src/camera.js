import { events } from "./Event";
import { GameOpject } from "./object/Hero/gameObject";
import { Vector2 } from './vector2';

export class Camera extends GameOpject{
    constructor(){
        super({});

events.on("HERO_POSITION",this,heroPosition =>{
    const personHalf = 8;
    const canvasWidth = 320;
    const canvasHight = 180;
    const halfWidth = personHalf + canvasWidth /2;
    const halfHight = personHalf + canvasHight /2;
      this.position = new Vector2(
        -heroPosition.x +halfWidth,
        -heroPosition.y +halfHight,)


    })

}
}