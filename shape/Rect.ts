import { Shape, Matrix, Point } from './Shape';

export default class Rect extends Shape{

  constructor(width:number, height: number){
    super(width, height);
  }

  render(fill:boolean=false):Matrix{
    let matrix:Matrix = [];
    let fillVal = +!fill;
    matrix = Array(this.height).fill(null).map((col,idx)=>{
      return (idx === 0 || idx === this.height-1)
              ? Array(this.width).fill(fillVal)
              : [fillVal, ...Array(this.width-2).fill(0) ,fillVal]
    });
    return matrix;
  }

  transpose(origin: Point, rect: Rect){

  }

  public static area(w: number, h: number):number{
    return w*h;
  }
}