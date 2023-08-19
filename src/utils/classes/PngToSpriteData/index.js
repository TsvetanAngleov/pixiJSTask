import * as PIXI from "pixi.js";
// used from https://github.com/TsvetanAngelov/SpaceShooter/blob/main/assets/utils/classes/ImageToSpriteData/index.js

/**
 * Used from {@link https://github.com/TsvetanAngelov/SpaceShooter/blob/main/assets/utils/classes/ImageToSpriteData/index.js}
 */

export default class PngToSpriteData {
  frames = {};
  meta = {};
  animations = {};

  #createFrames = (width = 0, height = 0) => {
    this.animations.frame.forEach((value, index) => {
      this.frames[value] = {
        frame: {
          x: index ? width * index + 1 : 0,
          y: 0,
          w: width,
          h: height,
          position: {
            x: width * index,
          },
        },
        sourceSize: { w: width, h: height },
        spriteSourceSize: { x: 0, y: 0, w: width, h: height },
      };
    });
  };

  constructor({imageName, numberOfFrames, width = 0, height = 0, name}) {
    this.width = width;
    this.height = height;
    this.animations = {
      frame: Array(numberOfFrames)
        .fill(``)
        .map((_, index) => `${name}_frame` + (index + 1)),
    };

    this.#createFrames(width, height);

    this.meta = {
      image: `../assets/${imageName}`,
      format: "RGBA8888",
      size: { w: numberOfFrames * width, h: height },
      scale: 0.5,
    };
  }
}
