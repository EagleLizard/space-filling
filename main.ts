
import Rect from './shape/Rect';
import Fill from './fill/Fill';

main();

function main(){
  let startRect = new Rect(5, 5);
  let matrix = startRect.render();
  matrix[3][3] = 1;
  let result = Fill.findRect(matrix);
  console.log(result);
  console.log(matrix);
}