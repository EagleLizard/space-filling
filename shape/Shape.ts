export type MatrixValue = (0|1);
export type Matrix = (MatrixValue[])[];
export type Point = {x:number, y:number};

export interface Shape{
  height: number;
  width: number;
  render(...args:any[]):Matrix;
  new (width: number, height: number, empty):Shape;
}

export abstract class Shape implements Shape{
  constructor(width:number, height:number){
    this.width = width;
    this.height = height;
  }
}