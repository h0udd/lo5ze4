
class Resources {
    constructor(){
        this.toload ={
          sky: "/sprites/sky.png",
          ground:"/sprites/ground.png",
          hero:"/sprites/hero-sheet1.png",
          shadow: "/sprites/shadow.png",
          rod:"/sprites/rod.png",
          flower:"/sprites/flower.png",
          underground:"/sprites/uerndground1.png",
        };
        this.images = {};
        Object.keys(this.toload).forEach(key =>{

          const img = new Image();
          
         const font = new FontFace(
          "Press Start 2P",
          "url(/sprites/font/Press_Start_2P/PressStart2P-Regular.ttf)"
        );
        this.fontPromise = font.load().then(loadedFont => {
          document.fonts.add(loadedFont);
        });

          img.src = this.toload[key];
          this.images[key] = {
            image: img,
            isLoaded: false
          }
          img.onload = () => {
            this.images[key].isLoaded = true;
          }

        })

    } 
}
export const resources = new Resources();
