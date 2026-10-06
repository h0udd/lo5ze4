import { resources } from "../../resource.js";
import { Rod } from "./rod/rod.js";

export class Flower extends Rod {
    constructor(x, y) {
        super(x, y);
	this.img = resources.images.flower;
        this.children[0].resource = resources.images.flower;
    }
}
