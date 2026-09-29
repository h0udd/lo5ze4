import { Vector2 } from "../../vector2";
import { events } from "../../Event";
export class GameOpject {
    constructor({position}){
        this.position = position ?? new Vector2(0,0);
        this.children = [];
        this.parent = null;
        this.hasReadyBeenCalled = false;
    }

    stepEntry(delta,root){
      this.children.forEach((child) => child.stepEntry(delta, root));
      if(!this.hasReadyBeenCalled){
        this.hasReadyBeenCalled = true;
        this.ready();
      }
      
      this.step(delta,root);  
    }
 ready(){

 }

    step (_delta){
    }

draw(ctx,x,y){
  const drawposX = x + this.position.x ;
  const drawposY = y + this.position.y ; 
  
  this.drawImage(ctx,drawposX,drawposY);
  this.children.forEach((child) => child.draw(ctx,drawposX,drawposY)); 
}
    drawImage(ctx,drawposX,drawposY){

    }
    destroy(){
     this.children.forEach(child => {
      child.destroy();
     })
     ///////////////////////////////////////////
      events.unsubscribe(this);
      //////////////////////////////////////////
     this.parent.removechild(this)
    }

   addChild(gameOpject){
    gameOpject.parent= this;
    this.children.push(gameOpject);}

    removechild(gameOpject){
      events.unsubscribe(gameOpject);
      this.children = this.children.filter(g => {
        return gameOpject !==g;
      })
    }
  }