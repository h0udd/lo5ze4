import { GameOpject } from "../gameObject";
import { Vector2 } from "../../../vector2";
import { resources } from "../../../resource";
import { Sprite } from "../../../spritet";
import { events } from "../../../Event";


export class Rod extends GameOpject{
constructor(x,y){
    super({
        position:new Vector2(x,y)
    });

    this.img = resources.images.rod;
    const sprite = new Sprite({
        resource: this.img,
        position: new Vector2(0 ,-5) 
    })

    this.addChild(sprite);
}

ready(){
    events.on("HERO_POSITION" ,  this  , pos => {
    //detect overlap...
    const roundedHeroX = Math.round(pos.x);
    const roundedHeroY = Math.round(pos.y);
   if(roundedHeroX === this.position.x && roundedHeroY === this.position.y){
    this.onCallideWithHero();
    }
    })
}

onCallideWithHero(){
// remove this instance from the scene 
this.destroy();

events.emit("HERO_PICKS_UP_ITEM",{
    image :this.img,
    position : this.position
})
}
}
