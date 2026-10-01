import { Vector2 } from "./Vector2.js";

export class Mouse {
  constructor(canvas) {
    this.position = new Vector2(0, 0);

    canvas.addEventListener('mousemove', (e) => {
      // console.log("window size:", window.innerWidth, window.innerHeight);
      // 320, 180 ==> canvas | myScreen bignumer, bignumber
      // bignumber/320, bignumber/180
      // 640/320, 360/180   
      // 320 is guranteed but 180 isnt | we need to calculate 180 manually
      //
      const currentWidthToHeightRatio = window.innerHeight / window.innerWidth; 
      const canvasScaleAmount = new Vector2(window.innerWidth/320, window.innerHeight/(320*currentWidthToHeightRatio));
      this.position.x = e.offsetX / canvasScaleAmount.x;
      this.position.y = e.offsetY / canvasScaleAmount.y;
    });
  }
}
