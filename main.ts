
const Canvas = require('drawille');

import Rect from './shape/Rect';
import Fill from './fill/Fill';


const NUM_FILLS = 1e5 + Math.floor(((new Date().getTime())/1e12));
const WIDTH = 100;
const HEIGHT = 100;
const DRAW_MS = 1;//1000/120;

let canvas = new Canvas(WIDTH, HEIGHT);

main();

function main(){
  let startRect = new Rect(WIDTH, HEIGHT);
  let matrix = startRect.render();
  let fillRect = Fill.rect(startRect, 1);

  drawN(fillRect, NUM_FILLS, 1);
}

function draw(rect: Rect){
  let fillMatrix = Rect.clone(rect).render();
  canvas.clear();
  for(var y = 0; y < fillMatrix.length; y++){
    let row = fillMatrix[y];
    for(var x = 0; x < row.length; ++x){
      if(fillMatrix[y][x] === 1){
        canvas.set(x,y);
      }
    }
  }
  process.stdout.write(canvas.frame());  
  canvas.clear();
}

function drawN(rect: Rect, n: number, step: number=1){
  if(n > 0){
    draw(rect);
    setTimeout(()=>{
      let filledRect = Fill.rect(rect, step);
      // If the new filled rect is the same as the
      //  previous rect, stop drawing (no new changes)
      if(!rect.equals(filledRect)){
        drawN(filledRect, n-1);
      }else{
        draw(filledRect);
      }
    }, DRAW_MS);
  }
}