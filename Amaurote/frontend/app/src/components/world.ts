import { IWorldObject } from "./world";
export interface IWorldObject {
  groundType?: number;
  builderType?: number;
}

export class World {
  objects: IWorldObject[];
  private _sizeX: number = 0;
  public get sizeX() {
    return this._sizeX;
  }
  private _sizeY: number = 0;
  public get sizeY() {
    return this._sizeY;
  }

  constructor(x: number, y: number) {
    this.objects = new Array<IWorldObject>(x * y);
    this._sizeX = x;
    this._sizeY = y;
    this._fillRandom();
  }

  public get(x: number, y: number) {
    return this.objects[y * this._sizeX + x];
  }

  public getCoord(i: number) {
    const x = i % this.sizeY;
    const y = i / this.sizeY;
    const result = { x, y };
    return result;
  }

  private _fillRandom() {
    for (var i = 0; i < this.objects.length; i++) {
      var groundType = Math.round(Math.random() * 10);
      var builderType = Math.round(Math.random() * 10);
      this.objects[i] = {
        groundType: groundType === 0 ? 0 : groundType,
        builderType: builderType === 0 ? 0 : builderType
      };
    }
  }
}
