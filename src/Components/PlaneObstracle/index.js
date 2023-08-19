import gsap from "gsap";
import getRandomInt from "../../utils/getRandomInt";
import Cover from "../../utils/classes/Cover";
import Explosion from "../Explosion";
// CONFIG - move it to config file

const PLANES = ["plane1", "plane2", "plane3"];
const COLORS = ["blue", "red", "yellow", "pink"];

const EVENTS = {
  ...Cover.events,
  REMOVED: "removed",
};

export default class PlaneObstracle extends Cover {
  constructor({ stage, spriteSheets, x, y, texture, lives = 1 }) {
    const URL = texture ? PlaneObstracle.randomAssetURL : undefined;

    super({
      stage: stage,
      spriteSheets: spriteSheets,
      URL: URL,
      texture: texture,
      lives: lives,
      x,
      y,
      explosion: Explosion,
    });
    this.id = Date.now();
    this.mass = 3;
  }

  static get randomAssetURL() {
    const plane = PLANES[getRandomInt(0, PLANES.length - 1)];
    const color = COLORS[getRandomInt(0, COLORS.length - 1)];
    return `assets/${plane}/${color}.png`;
  }

  // *** OVERWRITES ***

  static get events() {
    return EVENTS;
  }

  async explode() {
    await super.explode();
    this.lives === 0 && this.emit(EVENTS.REMOVED);
  }

  async onHit() {

    this.timeline.add(
      gsap.to(this, {
        x: "+=" + this.acceleration.x,
        y: "+=" + this.acceleration.y,
        duration: 3,
      }),
      "anim_start"
    );
    this.timeline.add(this.explode(), "anim_start");
    
    this.timeline.play();
  }
}
