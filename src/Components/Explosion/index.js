import AsincAction from "../../utils/classes/AsincAction";
import CustomAnimatedSprite from "../../utils/classes/CustomAnimatedSprite";

// used from https://github.com/TsvetanAngelov/SpaceShooter/blob/main/assets/utils/classes/ImageToSpriteData/index.js

/**
 * Used from {@https://github.com/TsvetanAngelov/SpaceShooter/blob/main/components/Explosion/index.js}
 */
export default class Explosion extends CustomAnimatedSprite {
  #completed = new AsincAction();
  constructor({
    imageName,
    numberOfFrames,
    app,
    x,
    y,
    width,
    height,
    rotation,
    name,
    animationSpeed,
    spriteSheet,
  }) {
    super({
      imageName,
      numberOfFrames,
      app,
      x,
      y,
      width,
      height,
      rotation,
      name,
      animationSpeed,
      spriteSheet,
    });
    this.appendTo(this);
  }

  async explode() {
    this.move((frame) => {
      if (this.animatedSprite.totalFrames === frame + 1) {
        this.animatedSprite.stop();
        this.animatedSprite.destroy();
        this.animatedSprite._textures={};

        this.#completed.complete();
      }
     
    });
    return this.#completed.wait();
  }
}
