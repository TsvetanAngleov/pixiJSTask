import * as PIXI from "pixi.js";
import gsap from "gsap";

const EVENTS = {
  CRASH: "crash",
  DESTROYED: "destroyed",
  HIT: "hit",
  ANIMATION_START: "animation_start",
  ANIMATION_END: "animation_end",
  POSITION_CHANGED:'position_changed',
};
// TODO: Add all props docs
/**
 * This is the detail about the constructor
 * @class class cover which extends PIXI.Sprite
 * @param  props all props
 * @param {Object} props.explosion [static reference to the class needed for the creation of explosion object]
 */
export default class Cover extends PIXI.Sprite {
  #lives = 1;
  #stage = {};
  #explosionTexture = {};
  #explosion = {};
  constructor({
    stage,
    spriteSheets,
    URL,
    texture,
    explosion,
    lives,
    x = 0,
    y = 0,
    width = 150,
    height = 150,
  }) {
    super(texture ? texture : PIXI.Texture.from(URL));

    this.#explosionTexture = spriteSheets.explosion;
    this.#explosion = explosion;
    this.#stage = stage;

    // TODO: move to config all hardcoded values

    this.height = height;
    this.width = width;
    this.initialX = x;
    this.x = x;
    this.initialY = y;
    this.y = y;
    this.mass = 3;
    lives && (this.#lives = lives);
    this.acceleration = new PIXI.Point(0);
    this.initTimeline();
    this.on(EVENTS.HIT, this.onHit);
  }

  static get events() {
    return EVENTS;
  }

  get lives() {
    return this.#lives;
  }

  addToStage() {
    this.#stage.addChild(this);
  }

  move(offsetX = 0, offsetY = 0) {
    this.x = this.x + offsetX;
    this.y = this.y + offsetY;
  }

  hit(x, y) {
    this.acceleration.set(x, y);
    this.emit(EVENTS.HIT);
  }

  initTimeline() {
    this.timeline = gsap.timeline({
      onUpdate: async () => {
       this.emit(EVENTS.POSITION_CHANGED);
      },
      onComplete: async () => {
        this.#lives -= 1;
        if (this.#lives === 0) return this.explode();
      },
    });
    this.timeline.pause();
  }

  async onHit() {
    // add asinc action here to block the game
    // TODO: need for implementing 'pinball logic' here -
    // TIPS: need to block the game and not catching keyboard events here
    // use gsap onUpdate to check for new collusion
    // on each colusion has to call this.explode()
    // on new colusion has to stop and clear the timeline and add new Tweens
    // at the end has to reset to the initial position
    // it might be achived within recrussive calls of this method(this.onHit)
    // this.on(EVENTS.HIT, () => this.onHit);

    this.timeline.add(
      gsap.to(this, {
        x: "+=" + this.acceleration.x,
        y: "+=" + this.acceleration.y,
        duration: 3,
      })
    );
    this.timeline.add(
      gsap.to(this, {
        x: this.initialX,
        y: this.initialY,
        duration: 3,
      })
    );
    this.emit(EVENTS.ANIMATION_START);
    await Promise.all([this.timeline.play(), this.explode()]).then(() => {
      this.emit(EVENTS.ANIMATION_END);
    });
  }

  async explode() {
    const { width, height } = this.texture.orig;
    const { power, x, y } = (() => {
      if (this.#lives === 0)
        return { power: width, x: width / 2, y: height / 2 };
      return { power: width / 4, x: width, y: height / 2 };
    }).bind(this)();

    const explosion = new this.#explosion({
      imageName: "explosion.png",
      numberOfFrames: 33,
      width: power,
      height: power,
      x: x,
      y: y,
      animationSpeed: 0.5,
      name: `hero_explosion`,
      spriteSheet: this.#explosionTexture,
    });

    await explosion.created;
    this.addChild(explosion.animatedSprite);
    this.emit(this.#lives === 0 ? EVENTS.DESTROYED : EVENTS.CRASH);
    await explosion.explode();
    this.removeChild(explosion);
  }
}
