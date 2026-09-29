import { moveTowards } from "../../helpers/moveTowrds";
import { Vector2 } from "../../vector2";
import { GameOpject } from "./gameObject";
import { Sprite } from '../../spritet.js';
import { resources } from '../../resource.js';
import { FramIndexPattern } from '../../frameIndexPatren.js';
import { PICK_UP_DOWN, STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from '../Hero/heroAnmation.js';
import { Input, UP, DOWN, LEFT, RIGHT } from '../../Input.js';
import { walls, isSpaceFree } from '../../helpers/grid.js';
import { Animations } from '../../animation.js';
import { events } from "../../Event.js";

export class Hero extends GameOpject{
    constructor(x,y){
        super({
            position : new Vector2(x,y) 
        });

        const shadow = new Sprite({
        resource:resources.images.shadow,
        frameSize: new Vector2( 32 ,32),
        position : new Vector2(-8 ,-19),
        })
        this.addChild(shadow);


        this.body =new Sprite({
          resource:resources.images.hero,
          frameSize: new Vector2(32,32),
          hFrames:3,
          vFrames:8,
          frame:1,
          position : new Vector2(-8 ,-20),
          animations: new Animations({ 
          walkDown : new FramIndexPattern(WALK_DOWN),
          walkUp : new FramIndexPattern(WALK_UP),
          walkLeft : new FramIndexPattern(WALK_LEFT),
          walkRight : new FramIndexPattern(WALK_RIGHT),       
          standDown : new FramIndexPattern(STAND_DOWN),
          standUp : new FramIndexPattern(STAND_UP),
          standLeft : new FramIndexPattern(STAND_LEFT),
          standRight : new FramIndexPattern(STAND_RIGHT),
          pickUpDown: new FramIndexPattern(PICK_UP_DOWN),

          })
        })
      this.addChild(this.body);
      this.facingDirection = DOWN;
      this.destinationPosition = this.position.duplicate();
      this.itemPickupTime = 0;
      this.itemPickupShall = null;


      events.on("HERO_PICKS_UP_ITEM", this ,data => {
        this.onPickUpItem(data)
      });
    }

    step(_delta, root){
      if(this.itemPickupTime > 0){
        this.workOnItemPickup(_delta);
      return;
      }


     const distance = moveTowards(this,this.destinationPosition,1);
     const hasArrived = distance <= 1;
     if(hasArrived){
        this.tryMove(root)
     }
     this.tryEmitPosition()
     
    }
    tryEmitPosition(){
      if (this.lastX === this.position.x && this.lastY === this.position.y){
      return;
      }
      this.lastX =  this.position.x;
      this.lastY =  this.position.y;
      events.emit("HERO_POSITION",this.position); 
    }

 tryMove(root){
    const {input} = root;

    if(!input.direction){
    if(this.facingDirection === LEFT){this.body.animations.play("standLeft")}
    if(this.facingDirection === RIGHT){this.body.animations.play("standRight")}
    if(this.facingDirection === UP){ this.body.animations.play("standUp")}
    if(this.facingDirection === DOWN){ this.body.animations.play("standDown")}
    return;
  }

 let nexX = this.destinationPosition.x;
 let nexY = this.destinationPosition.y;
 const gridSize = 16;


if( input.direction === DOWN)
{ nexY += gridSize;
this.body.animations.play("walkDown");
  
}

if( input.direction === UP)
{nexY -= gridSize;
this.body.animations.play("walkUp");
}

if( input.direction === LEFT)
{ nexX -= gridSize;
this.body.animations.play("walkLeft");
    
}

if( input.direction === RIGHT)
{nexX += gridSize;
this.body.animations.play("walkRight");

  }

this.facingDirection = input.direction ?? this.facingDirection;

if(isSpaceFree(walls,nexX,nexY)){
   this.destinationPosition.x = nexX;
   this.destinationPosition.y = nexY;
}
};


onPickUpItem({image , position}){
this.destinationPosition = position.duplicate();
  this.itemPickupTime = 2500;

  this.itemPickupShall = new GameOpject({});
  this.itemPickupShall.addChild(new Sprite({
    resource :image,
    position :new Vector2(0 ,-18)
  }))
  this.addChild(this.itemPickupShall);

}

workOnItemPickup(dalta){
  this.itemPickupTime -= dalta;
  this.body.animations.play("pickUpDown");

  if(this.itemPickupTime <= 0){
    this.itemPickupShall.destroy();
  }
}
}