import { resources } from './resource';
import { Sprite } from './spritet';
import { Vector2 } from './vector2';
import { GameLoop } from './GameLoop';
import { Input, UP, DOWN, LEFT, RIGHT } from './Input.js';
import { walls,cell2pixel, isSpaceFree } from './helpers/grid.js';
import { moveTowards } from './helpers/moveTowrds.js';
import { FramIndexPattern } from './frameIndexPatren.js';
import './style.css'  
import { STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from './object/Hero/heroAnmation.js';
import { Animations } from './animation.js';
import { GameOpject } from './object/Hero/gameObject.js';
import { Hero } from './object/Hero/hero.js';
import { events } from './Event.js';
import { Camera } from './camera.js';
import { Rod } from './object/Hero/rod/rod.js';
import { Inventory } from './object/Hero/inventory/inventory.js';
import { Mouse } from './Mouse.js';

import levelData from "./myLevels.json";


const canvas = document.querySelector("#game-canvas");
const ctx =  canvas.getContext("2d");
const mouse = new Mouse(canvas);

const mainScene = new GameOpject({
  position: new Vector2(0,0)
})

const skySprite = new Sprite({
  resource:resources.images.sky,
  frameSize:new Vector2(320, 180),
})

//mainScene.addChild(skySprite);

const graundSprite = new Sprite({
  resource:resources.images.ground,
  frameSize:new Vector2(320, 180),
}) 
//mainScene.addChild(graundSprite);

const hero = new Hero(cell2pixel(6,5))
mainScene.addChild(hero);


const camera = new Camera();
mainScene.addChild(camera);


//const rod = new Rod(gridCalls(7),gridCalls(6));
//mainScene.addChild(rod);


const inventory = new Inventory();


mainScene.input = new Input();



const update = (delta) => {
mainScene.stepEntry(delta,mainScene,1)
};

const draw = () => {
  ctx.clearRect(0,0,canvas.width ,canvas.height);
 
  if(currentShowSky) {
  skySprite.drawImage(ctx,0,0);}

 if(currentUseCamera){ 
   ctx.save();
   ctx.translate(camera.position.x ,camera.position.y); 
   mainScene.draw(ctx,0,0);
  ctx.restore();}
  else{
    mainScene.draw(ctx,0,0)
  }
   inventory.draw(ctx,0,0);
}

//change lebel------------------- 
 
let currentLevelName = "ground";
let currentLevelObject = null;
let currentObjects = [];
let currentShowSky = true;
let currentUseCamera = true;


const objectFactories = {
    rod: (x, y) => new Rod(x, y),
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

//ADD OBJJJ         
    currentObjects.forEach(obj => {
        obj.destroy();
        mainScene.children = mainScene.children.filter(c => c !== obj);
    });
    currentObjects = [];

    if (levelInfo.objects) {
        levelInfo.objects.forEach(objData => {
            const [ox, oy] = objData.position.split(",").map(Number);
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
    }
mainScene.addChild(currentLevelObject);
mainScene.children = [currentLevelObject, ...mainScene.children.filter(c => c !== currentLevelObject)];}

loadLevel("ground");

events.on("CHANGE_LEVEL_REQUESTED", null, (level) => {
   currentLevelName=level.name;
    loadLevel(currentLevelName);
});

//start the game 
const gameLoop = new GameLoop(update , draw);
gameLoop.start();
