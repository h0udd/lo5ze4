import { Vector2 } from "../vector2";
export const  walls = new Set();

/*
export const gridCalls = n => {
    return n * 16;   
}*/

export const isSpaceFree = (wall , x ,y ) => {
   const str = `${x},${y}`;
   const isWallPresent = wall.has(str);
    return !isWallPresent;
}

export const cell2pixel = (cell) => {
  return new Vector2(cell.x * 16, cell.y*16)
}

export const pixel2cell = (pixel) => {
   return new Vector2(Math.round(pixel.x/16), Math.round(pixel.y/16))
}

export function getSurroundingTiles(tileStr) {
  const [x, y] = tileStr.split(",").map(Number);
  return new Set([
    `${x},${y}`,
    `${x - 16},${y - 16}`,
    `${x},${y - 16}`,
    `${x + 16},${y - 16}`,
    `${x - 16},${y}`,
    `${x + 16},${y}`,
    `${x - 16},${y + 16}`,
    `${x},${y + 16}`,
    `${x + 16},${y + 16}`,
  ]);
}

 //console.log(getSurroundingTiles("64,48"));
