
import { Matrix, MatrixValue, Point } from '../shape/Shape';
import Rect from '../shape/Rect';

const RETRIES: number = 5;

export default class Fill {
  static getPoints(matrix:Matrix):Point[]{
    let width = matrix[0].length;
    let height = matrix.length;
    let points: Point[] = [];
    for(var y = 0; y < height; y++){
      for(var x = 0; x < width; x++){
        if(matrix[y][x] === 0){
          points.push({x:x,y:y});
        }
      }
    }
    return points;
  }
  /*
    The criteria for a valid rectangle is that the origin point
      must:
      1) Ortigin must be a 0 
      2) Be drawable to at least 2x2 without intersecting a 1 
  */
  static findRect(matrix: Matrix)
    :{origin: Point, w: number, h:number}{
    let retries = RETRIES;
    let availablePoints = Fill.getPoints(matrix);
    let randPos: number = -1;//pick a random point
    let result: Point = {x:-1,y:-1};
    let rayMatrix: Matrix = [[]];
    let rayMatrixHeight:number = -1;
    while(availablePoints.length){
      randPos = Math.floor(Math.random()*(availablePoints.length-1));
      console.log(randPos);
      if(Fill.canMakeRect(matrix, result = availablePoints[randPos])){
        break;
      }
      availablePoints.splice(randPos, 1);
      console.log(randPos);
      console.log(availablePoints[randPos]);
    }
    if(result.x != -1){
      // First, bisect the matrix at the x origin.
      rayMatrix = matrix.slice(result.y).map(row=>row.slice(result.x));
      Fill.rayTraceRect(rayMatrix);
    }
    return {
      origin: result,
      w: 0,
      h: 0
    }
  }

  private static canMakeRect(matrix:Matrix, origin: Point):boolean{
    let rowCheck = matrix[origin.y+1];
    let valid = (rowCheck !== undefined)
            && (matrix[origin.y][origin.x] === 0)
            && (rowCheck[origin.x] === 0)
            && (rowCheck[origin.x+1] === 0)
            && (matrix[origin.y][origin.x+1] === 0);
    return valid;
  }

  private static rayTraceRect(matrix: Matrix){
    // We can start from the known minimum bounds, {2,2}
    let xBound = 2;
    let yBound = 2;
    let area = Rect.area(xBound, yBound);
    console.log('traceX:');
    console.log(matrix);
    console.log(Fill.traceX(matrix));
    // For every row, if the bounds change recalculate 
    //  the area and redraw the rectangle if it's bigger
  }

  /*
    Takes a list of rows and a starting x value.
      Returns the index of the first value along the x axis that:
        1) is undefined
        2) is 1
  */
  private static traceX(rows: MatrixValue[][]): number[]{
    //first trace the x axis as far as possible
    let results: number[] = [];
    return rows.map(row=>{
      let doCheck = true;
      let width = 0;
      while(doCheck){
        if(row[width] !== 0){
          doCheck = false;
        }else{
          width++;
        }
      }
      return width;
    });
    
  }

}