import { Shape, Matrix, Point } from './Shape';

export type rectOverlay = { origin: Point, matrix: Matrix };

export default class Rect extends Shape{

  overlays: rectOverlay[];

  constructor(width:number, height: number){
    super(width, height);
    this.overlays = [];
  }

  render(fill:boolean=false):Matrix{
    let matrix:Matrix = [];
    let fillVal = +!fill;
    matrix = Array(this.height).fill(null).map((col,idx)=>{
      return (idx === 0 || idx === this.height-1)
              ? Array(this.width).fill(fillVal)
              : [fillVal, ...Array(this.width-2).fill(0) ,fillVal]
    });
    // apply overlays
    this.overlays.forEach(overlay=>{
      overlay.matrix.forEach((row, idx)=>{
        matrix[idx+overlay.origin.y]
          .splice(overlay.origin.x, row.length, ...row);
      })
    });
    return matrix;
  }

  insertOverlay(origin: Point, matrix: Matrix){
    this.overlays.push({
      origin: origin,
      matrix: matrix
    });
  }

  area(): number{
    return this.width*this.height;
  }

  isNullRect():boolean{
    return (this.width < 0) || (this.height < 0);
  }

  equals(rect: Rect):boolean{
    let matrix = this.render();
    let matrixCompare = rect.render();
    if((matrix.length !== matrixCompare.length)
      || (matrix[0].length !== matrixCompare[0].length)
    ){
      return false;
    }
    for(var y = 0; y < matrix.length; ++y){
      let row = matrix[y];
      let rowCompare = matrixCompare[y];
      for(var x = 0; x < row.length; ++x){
        if(row[x] !== rowCompare[x]){
          return false;
        }
      }
    }
    return true;
  }

  public static clone(rect: Rect){
    let result = new Rect(rect.width, rect.height);
    rect.overlays.forEach(overlay=>{
      result.insertOverlay(overlay.origin, overlay.matrix);
    });
    return result;
  }

  public static nullRect(): Rect{
    return new Rect(-1, -1);
  }

  public static area(w: number, h: number):number{
    return w*h;
  }

}