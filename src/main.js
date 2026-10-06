import { resources } from './resource';
import { Sprite } from './spritet';
import { GameLoop } from './GameLoop';
import { Input } from './Input.js';
import {cell2pixel} from './helpers/grid.js';
import './style.css'  
import { GameOpject } from './object/Hero/gameObject.js';
import { Hero } from './object/Hero/hero.js';
import { events } from './Event.js';
import { Camera } from './camera.js';
import { Inventory } from './object/Hero/inventory/inventory.js';
import { Vector2 } from './vector2.js';
import { InteractionSystem } from './Interaction.js';
import { drawInteractionMessage } from './interactionMessage.js';
import { loadLevel,currentShowSky,currentUseCamera} from './helpers/level.js';
import { drawWallsMode, drawWallsMouse, initWallsMode } from './helpers/wallMode.js';


const canvas = document.querySelector("#game-canvas");
const ctx =  canvas.getContext("2d");


const mainScene = new GameOpject({
  position: new Vector2(0,0)
})

const skySprite = new Sprite({
  resource:resources.images.sky,
  frameSize:new Vector2(320, 180),
})


const hero = new Hero(cell2pixel(6,5))
mainScene.addChild(hero);


const camera = new Camera();
mainScene.addChild(camera);
const inventory = new Inventory();
const interaction = new InteractionSystem();
mainScene.input = new Input();

initWallsMode(canvas, mainScene);

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

drawWallsMode(ctx, camera);


drawInteractionMessage(ctx,interaction.nearbyPoint)
  ctx.restore();

  drawWallsMouse(ctx);
  inventory.draw(ctx, 0, 0);
};


const game = { mainScene, hero, interaction };

loadLevel("ground", game);

events.on("CHANGE_LEVEL_REQUESTED", null, (level) => {
    loadLevel(level.name, game);
});

//start the game 
const gameLoop = new GameLoop(update , draw);
resources.fontPromise.then(()=>{ 
gameLoop.start();
});