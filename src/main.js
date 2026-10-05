import { resources } from './resource';
import { Sprite } from './spritet';
import { GameLoop } from './GameLoop';
import { Input } from './Input.js';
import { walls,cell2pixel} from './helpers/grid.js';
import './style.css'  
import { GameOpject } from './object/Hero/gameObject.js';
import { Hero } from './object/Hero/hero.js';
import { events } from './Event.js';
import { Camera } from './camera.js';
import { Rod } from './object/Hero/rod/rod.js';
import { Inventory } from './object/Hero/inventory/inventory.js';
import { Mouse } from './Mouse.js';
import { Vector2 } from './vector2.js';
import levelData from "./myLevels.json";
import { Flower } from './object/Hero/flower.js';
import { InteractionSystem } from './Interaction.js';
import { drawInteractionMessage } from './interactionMessage.js';

const canvas = document.querySelector("#game-canvas");
const ctx =  canvas.getContext("2d");
const mouse = new Mouse(canvas);
let tileMousePos =new Vector2();
let WALL_MODE =true;

const mainScene = new GameOpject({
  position: new Vector2(0,0)
})

const skySprite = new Sprite({
  resource:resources.images.sky,
  frameSize:new Vector2(320, 180),
})


const graundSprite = new Sprite({
  resource:resources.images.ground,
  frameSize:new Vector2(320, 180),
}) 
//mainScene.addChild(graundSprite);

const hero = new Hero(cell2pixel(6,5))
mainScene.addChild(hero);


const camera = new Camera();
mainScene.addChild(camera);
const inventory = new Inventory();
const interaction = new InteractionSystem();
mainScene.input = new Input();

mainScene.input.spaceAction = () => {
  const formatedPos = `${tileMousePos.x},${tileMousePos.y}`;
  if (walls.has(formatedPos)) {
    walls.delete(formatedPos);
  } else {
    walls.add(formatedPos);
  }
  console.warn(JSON.stringify([...walls]));
};


const update = (delta) => {
mainScene.stepEntry(delta,mainScene,1)
};

const draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (currentShowSky) {
    skySprite.drawImage(ctx, 0, 0);
  }

  ctx.save();
  if (currentUseCamera) {
    ctx.translate(camera.position.x, camera.position.y);
  }
  mainScene.draw(ctx, 0, 0);

  if (WALL_MODE) {

 //drawing walls  
    walls.forEach(wall => {
      const [x, y] = wall.split(",").map(Number);
      const pos = new Vector2(x, y);
      pos.draw(ctx, "red", 16);
    });

//drawing mouse tile position 
    tileMousePos.x = Math.round((-camera.position.x + mouse.position.x - 8) / 16) * 16;
    tileMousePos.y = Math.round((-camera.position.y + mouse.position.y - 8) / 16) * 16;
    tileMousePos.draw(ctx, "yellow", 16);
   ctx.fillStyle = "black";
   ctx.font = "8px 'Press Start 2P', monospace";
   ctx.fillText(`${tileMousePos.x},${tileMousePos.y}`, tileMousePos.x +15, tileMousePos.y);
    
  }
//messages 
drawInteractionMessage(ctx,interaction.nearbyPoint)
  ctx.restore();

  if (WALL_MODE) { mouse.position.draw(ctx); }
  inventory.draw(ctx, 0, 0);
};
//change lebel------------------- 
 
let currentLevelName = "ground";
let currentLevelObject = null;
let currentObjects = [];
let currentShowSky = true;
let currentUseCamera = true;

const objectFactories = {
    rod: (x, y) => new Rod(x, y),
    flower: (x,y) => new Flower(x,y)
};

function loadLevel(levelName) {
    const levelInfo = levelData[levelName];
    if (!levelInfo) return;

    currentShowSky = levelInfo.showSky;
    currentUseCamera = levelInfo.useCamera;

    if (currentLevelObject) {
        currentLevelObject.destroy();
    }

    currentLevelObject = new GameOpject({
        position: new Vector2(0, 0)
    });

    const levelSprite = new Sprite({
        resource: resources.images[levelInfo.img_path],
        frameSize:new Vector2(-1,-1),
        position: new Vector2(0, 0),
    });
    currentLevelObject.addChild(levelSprite);

 if (typeof levelInfo.hero === "string") {
        const [hx, hy] = levelInfo.hero.split(",").map(Number);
        hero.position = new Vector2(hx, hy);
    } else if (levelInfo.hero) {
        hero.position = new Vector2(levelInfo.hero.x, levelInfo.hero.y);
    }
    hero.destinationPosition = hero.position.duplicate();

    walls.clear();
    if (levelInfo.walls) {
        levelInfo.walls.forEach(wallCoord => walls.add(wallCoord));
    }
    interaction.reset(); 
//ADD OBJJJ      
    currentObjects.forEach(obj => {
        obj.destroy();
        mainScene.children = mainScene.children.filter(c => c !== obj);
    });
    currentObjects = [];

    if (levelInfo.objects) {
      levelInfo.objects.forEach(objData => {
            const [ox, oy] = objData.position.split(",").map(Number);
            interaction.addPoint(objData.name ,objData.position);
            const factory = objectFactories[objData.name];
            if (!factory) {
                console.warn(`no object named : ${objData.name}`);
                return;
            }
            const newObj = factory(ox, oy);
            mainScene.addChild(newObj);
            currentObjects.push(newObj);
        });
      }   
mainScene.addChild(currentLevelObject);
mainScene.children = [currentLevelObject, ...mainScene.children.filter(c => c !== currentLevelObject)];
      }
loadLevel("ground");

events.on("CHANGE_LEVEL_REQUESTED", null, (level) => {
    loadLevel(level.name);
});

//start the game 
const gameLoop = new GameLoop(update , draw);
resources.fontPromise.then(()=>{ 
gameLoop.start();
});