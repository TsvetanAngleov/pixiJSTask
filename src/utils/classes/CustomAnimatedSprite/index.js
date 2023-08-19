import * as PIXI from "pixi.js";
import AsincAction from "../AsincAction";
// TODO make it static field for the class
import APPENDING_STATUSES from "../../availableAppendingStatuses.js";

// used from https://github.com/TsvetanAngelov/SpaceShooter/blob/main/assets/utils/classes/CustomAnimatedSprite/index.js

/**
 * Used from {@link https://github.com/TsvetanAngelov/SpaceShooter/blob/main/assets/utils/classes/CustomAnimatedSprite/index.js}
 */
export default class CustomAnimatedSprite {
  animatedSprite = {};
  #spriteSheet = {};
  #animatedSpriteSettings = {};
  #APPENDING_STATUS = CustomAnimatedSprite.availableStatuses.UNSTATED;
  #created = {};
  #clerCachedTextureEntries = () => undefined;
  name = "";

  constructor({
    x = 150,
    y = 150,
    rotation = 90 * (Math.PI / 180),
    animationSpeed = 0.027,
    name,
    spriteSheet,
    width=300,
    height=300,
  }) {
    this.name = name;
    this.#animatedSpriteSettings.animationSpeed = animationSpeed;
    this.#animatedSpriteSettings.x = x;
    this.#animatedSpriteSettings.y = y;
    this.#animatedSpriteSettings.width = width;
    this.#animatedSpriteSettings.height = height;
    this.#animatedSpriteSettings.rotation = rotation;
    this.#spriteSheet = spriteSheet;
    this.#created = new AsincAction();

    // clearCashe is moved outside of the class to make the class itself more readable
    this.#clerCachedTextureEntries = (props) => clearCache(props);
  }

  static get availableStatuses() {
    return APPENDING_STATUSES;
  }

  get created() {
    return this.#created.wait();
  }

  appendTo = (stage) => {
    this.#APPENDING_STATUS = CustomAnimatedSprite.availableStatuses.PENDING;
    return this.#spriteSheet
      .parse()
      .then(() => {
        this.#clerCachedTextureEntries(this.#spriteSheet);
        this.animatedSprite = new PIXI.AnimatedSprite(
          this.#spriteSheet.animations.frame
        );

        (this.animatedSprite.name = this.name),
          (this.animatedSprite.animationSpeed =
            this.#animatedSpriteSettings.animationSpeed);
        this.animatedSprite.x = this.#animatedSpriteSettings.x;
        this.animatedSprite.y = this.#animatedSpriteSettings.y;
        this.animatedSprite.width = this.#animatedSpriteSettings.width;
        this.animatedSprite.height = this.#animatedSpriteSettings.height;
        this.animatedSprite.rotation = this.#animatedSpriteSettings.rotation;
        this.animatedSprite.anchor.set(0.5, 0.5);
        this.animatedSprite.autoUpdate;
        this.#created.complete();
      })
      .then(
        () =>
          (this.#APPENDING_STATUS =
            CustomAnimatedSprite.availableStatuses.SUCCESS)
      );
  };

  handleOrientation = (e, callback = undefined) => {
    if (!callback) {
      let position = e.data.global;
      const dx = position.x - this.animatedSprite.x;
      const dy = position.y - this.animatedSprite.y;

      this.animatedSprite.rotation = Math.atan2(dy, dx) + 90 * (Math.PI / 180);
      return;
    }
    callback(e);
  };

  async move(handleAnimation = undefined) {
    async function moveAfterAppend(currentInstance) {
      await currentInstance.created;
      if (handleAnimation)
        currentInstance.animatedSprite.onFrameChange = (frame) =>
          handleAnimation(frame);

      return currentInstance.animatedSprite.play();
    }
    return moveAfterAppend(this);
  }

  // TODO make it getter
  getAppendingStatus = () => this.#APPENDING_STATUS;
}

// TODO need improvemt to catch all of the cases
const clearCache = (texture) => {
  if (!texture?.textures || texture?.textures?.lenght === 0) return;
  let cache = PIXI.utils.TextureCache;
  Object.keys(texture.textures).forEach((key) => {
    if (cache[key]) {
      PIXI.Texture.removeFromCache(key);
    }
  });
};
