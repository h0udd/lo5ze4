import { moveTowards } from "../../helpers/moveTowrds";
import { Vector2 } from "../../vector2";
import { GameOpject } from "./gameObject";
import { Sprite } from '../../spritet.js';
import { resources } from '../../resource.js';
import { FramIndexPattern } from '../../frameIndexPatren.js';
import { STAND_DOWN, STAND_LEFT, STAND_RIGHT, STAND_UP, WALK_DOWN, WALK_LEFT, WALK_RIGHT, WALK_UP } from '../Hero/heroAnmation.js';
import { UP, DOWN, LEFT, RIGHT } from '../../Input.js';
import { walls, isSpaceFree } from '../../helpers/grid.js';
import { Animations } from '../../animation.js';
import { events } from "../../Event.js";

export class Monster extends GameOpject {
  constructor(x, y) {
    super({ position: new Vector2(x, y) });

    const shadow = new Sprite({
      resource: resources.images.shadow,
      frameSize: new Vector2(32, 32),
      position: new Vector2(-8, -19),
    });
    this.addChild(shadow);

    this.body = new Sprite({
      resource: resources.images.monster,      
      frameSize: new Vector2(32, 32),
      hFrames: 3,
      vFrames: 8,
      frame: 1,
      position: new Vector2(-8, -20),
      animations: new Animations({
        walkDown: new FramIndexPattern(WALK_DOWN),
        walkUp: new FramIndexPattern(WALK_UP),
        walkLeft: new FramIndexPattern(WALK_LEFT),
        walkRight: new FramIndexPattern(WALK_RIGHT),
        standDown: new FramIndexPattern(STAND_DOWN),
        standUp: new FramIndexPattern(STAND_UP),
        standLeft: new FramIndexPattern(STAND_LEFT),
        standRight: new FramIndexPattern(STAND_RIGHT),
      }),
    });
    this.addChild(this.body);

    this.facingDirection = DOWN;
    this.destinationPosition = this.position.duplicate();
    this.speed = 0.5;            
    this.chaseRange = 16 * 8;    
    this.heroPosition = null;
    this.hitCooldown = 0;

    events.on("HERO_POSITION", this, pos => {
      this.heroPosition = pos;
    });
  }

  step(delta, root) {
    if (this.hitCooldown > 0) this.hitCooldown -= delta;

    moveTowards(this, this.destinationPosition, this.speed);

    const hasArrived =
      this.position.x === this.destinationPosition.x &&
      this.position.y === this.destinationPosition.y;

    if (hasArrived) {
      this.tryChase();
    }
    this.checkHitHero();
  }

  tryChase() {
    if (!this.heroPosition) return;

    const dx = this.heroPosition.x - this.position.x;
    const dy = this.heroPosition.y - this.position.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.chaseRange || dist < 8) {
      this.playStand();
      return;
    }

    const gridSize = 16;
    const stepX = { x: Math.sign(dx) * gridSize, y: 0 };
    const stepY = { x: 0, y: Math.sign(dy) * gridSize };

    const options = Math.abs(dx) > Math.abs(dy) ? [stepX, stepY] : [stepY, stepX];

    for (const s of options) {
      if (s.x === 0 && s.y === 0) continue;
      const nextX = this.destinationPosition.x + s.x;
      const nextY = this.destinationPosition.y + s.y;

      if (isSpaceFree(walls, nextX, nextY)) {
        this.destinationPosition.x = nextX;
        this.destinationPosition.y = nextY;
        this.playWalk(s);
        return;
      }
    }
    this.playStand(); 
  }

  playWalk(s) {
    if (s.x > 0) { this.facingDirection = RIGHT; this.body.animations.play("walkRight"); }
    if (s.x < 0) { this.facingDirection = LEFT;  this.body.animations.play("walkLeft"); }
    if (s.y > 0) { this.facingDirection = DOWN;  this.body.animations.play("walkDown"); }
    if (s.y < 0) { this.facingDirection = UP;    this.body.animations.play("walkUp"); }
  }

  playStand() {
    if (this.facingDirection === LEFT)  this.body.animations.play("standLeft");
    if (this.facingDirection === RIGHT) this.body.animations.play("standRight");
    if (this.facingDirection === UP)    this.body.animations.play("standUp");
    if (this.facingDirection === DOWN)  this.body.animations.play("standDown");
  }

  checkHitHero() {
    if (!this.heroPosition || this.hitCooldown > 0) return;
    const d = Math.hypot(
      this.heroPosition.x - this.position.x,
      this.heroPosition.y - this.position.y
    );
    if (d < 10) {
      events.emit("MONSTER_HITS_HERO", this);
      this.hitCooldown = 1000; 
    }
  }
}