import { events } from './Event.js';
import { getSurroundingTiles } from './helpers/grid.js';

const interactors = {
  "rod":() => console.log("rod"),
  "fish": () => console.log("Fish"),
  "flower":() => console.log("Flower"),
};

export class InteractionSystem {
  constructor() {
    this.interaction_points = [];
    this.interaction_func = null;
    this.nearbyPoint = null;

    events.on("HERO_POSITION", this, heroPosition => {
      this.nearbyPoint = null;
      this.interaction_func = null;
      const heroTile = `${heroPosition.x},${heroPosition.y}`;
      const tilesAroundHero = getSurroundingTiles(heroTile);

      this.interaction_points.forEach(point => {
        if (tilesAroundHero.has(point.position)) {
          this.nearbyPoint = point;
          this.interaction_func = point.action;
        }
      });
    });

    events.on("INTERACTION", this, () => {
      if (this.interaction_func) this.interaction_func();
    });
  }

  reset() {
    this.interaction_points = [];
    this.nearbyPoint = null;
    this.interaction_func = null;
  }

  addPoint(name, position) {
    if (!interactors[name]) return;
    this.interaction_points.push({ name, position, action: interactors[name] });
  }
}