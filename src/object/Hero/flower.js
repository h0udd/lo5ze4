import { resources } from "../../resource.js";
import { Rod } from "./rod/rod.js";

export class Flower extends Rod {
    constructor(x, y) {
        super(x, y);
        
        if (this.children && this.children[0]) {
            this.children[0].resource = resources.images.flower;
        }
    }
}