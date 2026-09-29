export class FramIndexPattern {
    constructor (animationContfig){
        this.currentTime = 0;
        this.animationContfig = animationContfig;
        this.duration = animationContfig.duration ?? 500;

    }
    get frame(){
        const {frames} = this.animationContfig;
        for(let i = frames.length - 1 ; i>=0 ; i-- ){
            if(this.currentTime >= frames[i].time){
                return frames[i].frame;
            }
        }
    throw "time is before the first keyframe";
    }
/*
i=3: frames[3].time = 300 → 150 >= 300? 
i=2: frames[2].time = 200 → 150 >= 200? 
i=1: frames[1].time = 100 → 150 >= 100? ! →  frames[1].frame = 0
*/
   step(delta){
    this.currentTime += delta;
    if(this.currentTime >= this.duration){
        this.currentTime =0;  
    }
   } 
}