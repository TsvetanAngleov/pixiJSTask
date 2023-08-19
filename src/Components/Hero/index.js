import * as PIXI from "pixi.js";
import gsap from "gsap";
import Cover from "../../utils/classes/Cover";
import Explosion from "../Explosion";

// const KEY_CODES = {
//   left: 37,
//   up: 38,
//   right: 39,
//   down: 40,
// };

// const MOVEMENT_OFFSET = {
//   left: +5,
//   up: -5,
//   right: -5,
//   down: +5,
// };

const EVENTS = {
  ...Cover.events,
};

export default class Hero extends Cover {
  constructor({ stage, spriteSheets, lives, x, y }) {
    super({
      x: x,
      y: y,
      stage: stage,
      spriteSheets: spriteSheets,
      URL: "assets/plane1/blue.png",
      lives: lives,
      explosion: Explosion,
    });
  }

  static get events() {
    return EVENTS;
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
this.timeline.clear();
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
}
