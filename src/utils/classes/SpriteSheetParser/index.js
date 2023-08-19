import * as PIXI from "pixi.js";
import PngToSpriteData from "../PngToSpriteData";

export default class SpriteSheetParser {
  #textures = {};
  #parseJson(asset) {
    const data = new PngToSpriteData(asset);
    this.#textures[asset.name] = new PIXI.Spritesheet(
      PIXI.BaseTexture.from(data.meta.image),data
    );
  }

  constructor(assets = []) {
    assets?.length > 0 && assets.forEach((asset) => this.#parseJson(asset));
  }

  get textures() {
    return  this.#textures;
  }
}
