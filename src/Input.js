import { events } from './Event.js';

export const LEFT = "LEFT";
export const RIGHT = "RIGHT";
export const UP = "UP";
export const DOWN = "DOWN";

export class Input {
    constructor() {
        this.heldDirections = [];
        this.spaceAction =() => {console.log("space!")};

        document.addEventListener("keydown", (e) => {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                this.onArrowPressed(UP);
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                this.onArrowPressed(DOWN);
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.onArrowPressed(LEFT);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.onArrowPressed(RIGHT);
            }
          
            if (e.code === "KeyQ") {
             //console.log("QQQqqq");
             events.emit("CHANGE_LEVEL_REQUESTED",{name :"ground"});
             }
              if (e.code === "KeyE") {
             //console.log("EEEE");
             events.emit("CHANGE_LEVEL_REQUESTED",{name :"underground"});
             }
              if (e.code === "Space") {
              this.spaceAction();             
             }
        });

        document.addEventListener("keyup", (e) => {
            if (e.code === "ArrowUp" || e.code === "KeyW") {
                this.onArrowReleased(UP);
            }
            if (e.code === "ArrowDown" || e.code === "KeyS") {
                this.onArrowReleased(DOWN);
            }
            if (e.code === "ArrowLeft" || e.code === "KeyA") {
                this.onArrowReleased(LEFT);
            }
            if (e.code === "ArrowRight" || e.code === "KeyD") {
                this.onArrowReleased(RIGHT);
            }

        });
    }

    get direction() {
        return this.heldDirections[0];
    }

    onArrowPressed(direction) {
        if (this.heldDirections.indexOf(direction) === -1) {

            this.heldDirections.unshift(direction);
        }
    }

    onArrowReleased(direction) {
        const index = this.heldDirections.indexOf(direction);
        if (index === -1) {
            return;
        }
        this.heldDirections.splice(index, 1);
    }
}