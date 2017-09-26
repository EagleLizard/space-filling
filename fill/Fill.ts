
import { 
  Matrix, 
  MatrixValue, 
  Point,
  getDeadPoint
} from '../shape/Shape';
import Rect from '../shape/Rect';

const RETRIES: number = 15;

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

  static rect(rect: Rect, n: number): Rect{
    let retries = RETRIES;
    rect = Rect.clone(rect); //copy
    while(0 < n--){
      let matrix = rect.render();
      let foundRect = Fill.findRect(matrix);
      if(foundRect.rect === null || foundRect.rect.isNullRect()){
        break;
      }
      rect.insertOverlay(foundRect.origin, foundRect.rect.render());
    }
    return rect;
  }
  /*
    The criteria for a valid rectangle is that the origin point
      must:
      1) Ortigin must be a 0 
      2) Be drawable to at least 2x2 without intersecting a 1 
  */
  static findRect(matrix: Matrix)
    :{origin: Point, rect: Rect}{
    let availablePoints = Fill.getPoints(matrix);
    let randPos: number = -1;//pick a random point
    let result: Point = getDeadPoint();
    let resultRect: Rect = Rect.nullRect();
    let rayMatrix: Matrix = [[]];
    while(availablePoints.length){
      randPos = Math.floor(Math.random()*(availablePoints.length-1));
      result = availablePoints[randPos];
      if(Fill.canMakeRect(matrix, result)){
        if(result.x != -1){
          // First, bisect the matrix at the x origin.
          rayMatrix = matrix
            .slice(result.y)
            .map(row=>row.slice(result.x));
          resultRect = Fill.rayTraceRect(rayMatrix) || null;
          if(resultRect !== null){
            break;
          }else{
            resultRect = Rect.nullRect();
            result = getDeadPoint();
          }
        }
      }else{
        result = getDeadPoint();
      }
      availablePoints.splice(randPos, 1);
      if(availablePoints.length){
        continue;
      }
    }
    return {
      origin: result,
      rect: resultRect
    }
  }

  private static canMakeRect(matrix:Matrix, origin: Point):boolean{
    // Need to check the columns at origin.x, origin.x+1
    //  and the rows and origin.y, origin.y+1
    let valid = [
      ...matrix[origin.y].slice(origin.x, origin.x+2),
      ...matrix[origin.y+1].slice(origin.x, origin.x+2)
    ].every(val=>val === 0);
    return valid;
  }

  private static rayTraceRect(matrix: Matrix):Rect{
    let rayTrace = Fill.traceX(matrix);
    let rect = Fill.maxRectangle(rayTrace);
    return rect;
  }

  /*
    Takes a list of rows and a starting x value.
      Returns the result of ray-tracing each row until
      minimum conditions are met.
  */
  private static traceX(rows: MatrixValue[][]): number[]{
    let results: number[] = [];
    for(var y = 0; y < rows.length; ++y){
      let row = rows[y];
      let width = 0;
      let breakOuter = false;
      for(var x = 0; x < row.length; ++x){
        if(row[x] === 0){
          width++;
        }else{
          let lastResult = results[results.length-1]
          if(lastResult !== undefined){
            breakOuter = lastResult > width;
            break;
          }
          if((width < 2) 
            || ((lastResult !== undefined) 
                && (width > lastResult))){
            breakOuter = true;
            break;
          }
        }
      }
      if(breakOuter) break;
      if(width >= 2){
        results.push(width);
      }
    }
    return results;
  }

  /*
    Returns possible (maximum area) rectangles given 
      a raytrace result, where each rectangle is contiguous 
      along the y axis in width.
    
    EX: [2,2,1,2] would return:
        Rect {width: 2, height: 2}
      The Rect of value {width: 1, height: 4} is omitted because
        it does not satisfy the minimum rectangle condition
        minWidth = 2, minHeight = 2.
  */
  private static maxRectangle(rayTrace: number[]): Rect{
    let lastWidth = rayTrace[0];
    let currentWidth = lastWidth;
    let rectangles: Rect[] = [];
    for(var i = 0; i < rayTrace.length; ++i){
      currentWidth = rayTrace[i];
      if((currentWidth !== lastWidth)
        || (i === rayTrace.length-1)){
          rectangles.push(new Rect(lastWidth, i+1));
      }
      lastWidth = currentWidth;
    }
    let result = rectangles
    .filter(rect=>{
      return (rect.width > 1) && (rect.height > 1);
    })
    .reduce((acc,curr)=>{
      if(acc === undefined) return curr;
      if(curr === undefined) return acc;
      return (acc.area() >= curr.area()) ? acc : curr;
    }, undefined);
    return result || null;
  }

}