import * as PIXI from "pixi.js";

export default class Background extends PIXI.TilingSprite {
  #speed = 0;
  #stage = {};
  //TODO add bottom background
  constructor({ texture, width, height, config, stage }) {
    super(texture, width, height);

    // TODO move the speed to config file and pass it to the constructor
    this.#speed = config.speed;
    this.#stage = stage;
    this.position.set(0, 0);
    this.addToStage();
  }

  async addToStage() {
    this.#stage.addChild(this);
  }

  updateBg = (offsetX, offsetY) => {
    offsetX && (this.tilePosition.x = this.tilePosition.x + offsetX);
    offsetY && (this.tilePosition.y = this.tilePosition.y + offsetY);
  };
}