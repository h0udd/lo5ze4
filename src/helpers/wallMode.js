import { walls } from '../helpers/grid.js';
import { Mouse } from '../Mouse.js';
import { Vector2 } from '../vector2.js';

let mouse = null;
let tileMousePos = new Vector2();
let WALL_MODE = true;

export function initWallsMode(canvas, mainScene) {
  mouse = new Mouse(canvas);

  mainScene.input.spaceAction = () => {
    const formatedPos = `${tileMousePos.x},${tileMousePos.y}`;
    if (walls.has(formatedPos)) {
      walls.delete(formatedPos);
    } else {
      walls.add(formatedPos);
    }
    console.warn(JSON.stringify([...walls]));
  };
}

export function drawWallsMode(ctx, camera) {
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
}

export function drawWallsMouse(ctx) {
  if (WALL_MODE) { mouse.position.draw(ctx); }
}