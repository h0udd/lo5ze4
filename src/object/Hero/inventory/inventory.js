import { events } from "../../../Event";
import { resources } from "../../../resource";
import { Sprite } from "../../../spritet";
import { Vector2 } from "../../../vector2";
import { GameOpject } from "../gameObject";

export class Inventory extends GameOpject{
    constructor(){
        super({
            position:new Vector2(3,8)
        });
       this.nextId = 0;
        this.items = [
            { id :-1 , image :resources.images.rod},
            { id :-2 , image :resources.images.rod},
        ]

     events.on("HERO_PICKS_UP_ITEM",this , data =>{
      this.nextId +=1;  
      this.items.push({ 
      id : this.nextId,
      image : data.image

      })
      this.renderInventory();
        })


        this.renderInventory();
    }

renderInventory(){
this.children.forEach(child => child.destroy())

this.items.forEach((item, index)=> {
  const sprite =new Sprite({
        resource : item.image,
        position: new Vector2 (index * 12 ,0 )
        })
        this.addChild(sprite);
 })
    }


removeFromeInventory(id){
this.items = this.items.filter( item =>  item.id !== id);
this.renderInventory();


}


}
