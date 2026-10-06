import { resources } from '../resource.js';
import { Sprite } from '../spritet.js';
import { walls } from '../helpers/grid.js';
import { GameOpject } from '../object/Hero/gameObject.js';
import { Rod } from '../object/Hero/rod/rod.js';
import { Flower } from '../object/Hero/flower.js';
import { Vector2 } from "../vector2";
import levelData from "../myLevels.json";

let currentLevelName = "ground";
let currentLevelObject = null;
let currentObjects = [];
export let currentShowSky = true;
export let currentUseCamera = true;

const objectFactories = {
    rod: (x, y) => new Rod(x, y),
    flower: (x,y) => new Flower(x,y)
};

export function loadLevel(levelName, { mainScene, hero, interaction }) {
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