import * as PIXI from "pixi.js";
import gsap from "gsap";
import SpriteSheetParser from "./utils/classes/SpriteSheetParser";
import spriteSheetsConfig from "./utils/spriteSheetsConfig";
import Hero from "./Components/Hero";
import Background from "./Components/Background";
import Obstracles from "./Components/Obstracles";
import SoundEngine from "./SoundEngine";
import Status from "./UIComponents/Status";
// TODO create game controler class and move there most of the logic from this file
Status.gameAllowed = false;
const root = document.querySelector("#heroEscape");
document.querySelector("#playButton").addEventListener("click", () => {
  root.style.visibility = "visible";
  document.querySelector("#playButton").style.display = "none";
  Status.gameAllowed = true;
});

const checkForColusion = () => {
  obstracles.children.every((child) => {
    if (setAcceleration(hero, child)) {
      return false;
    }
    return true;
  });
};

function testForColusion(bounds1, bounds2) {
  return (
    bounds1.x < bounds2.x + bounds2.width &&
    bounds1.x + bounds1.width > bounds2.x &&
    bounds1.y < bounds2.y + bounds2.height &&
    bounds1.y + bounds1.height > bounds2.y
  );
}

function setAcceleration(object1, object2) {
  const bounds1 = object1.getBounds();
  const bounds2 = object2.getBounds();
  if (testForColusion(bounds1, bounds2)) {
    Status.gameAllowed = false;
    const vRelativeVelocity = new PIXI.Point(
      bounds1.x - bounds2.x,
      bounds1.y - bounds2.y
    );

    object1.hit(
      impulsePower * vRelativeVelocity.x,
      impulsePower * vRelativeVelocity.y
    );
    object2.hit(
      -impulsePower * vRelativeVelocity.x,
      -impulsePower * vRelativeVelocity.y
    );

    return true;
  }
  return false;
}

const addFeature = (name, feature) => (features[name] = feature);
const features = {};
const speed = 5;
const height = 500;
const width = 800;
const impulsePower = 1;
const spriteSheets = new SpriteSheetParser(spriteSheetsConfig).textures;
const soundEngine = new SoundEngine();
addFeature("soundEngine", soundEngine);

let app = new PIXI.Application({
  width: window.innerWidth / 2,
  height,
  view: root,
  backgroundColor: 0x2980b9,
});

const bg = await PIXI.Assets.load("../assets/bg.jpg");
const background = new Background({
  texture: bg,
  width,
  height,
  config: { speed },
  stage: app.stage,
});
addFeature("background", background);
const hero = new Hero({
  stage: app.stage,
  spriteSheets: { explosion: spriteSheets["explosion"] },
  lives: 5,
  x: 100,
  y: 300,
});
addFeature("hero", hero);
hero.addToStage();
hero.on(Hero.events.ANIMATION_START, () => {
  Status.gameAllowed = false;
});
hero.on(Hero.events.ANIMATION_END, () => {
  Status.gameAllowed = true;
});
hero.on(Hero.events.POSITION_CHANGED, checkForColusion);
hero.acceleration = new PIXI.Point(0);
const obstracles = new Obstracles({
  stage: app.stage,
  spriteSheets: { explosion: spriteSheets["explosion"] },
});
addFeature("obstracles", obstracles);

// need for improvement
let allowKeyDownListener = true;
window.onkeydown = (e) => {
  if (!Status.gameAllowed || !allowKeyDownListener) return;
  allowKeyDownListener = false;
  checkForColusion();
  allowKeyDownListener = true;

  switch (e.keyCode) {
    case 37:
      background.updateBg(speed);
      obstracles.updateBg(speed);
      break;
    case 38:
      background.updateBg(0, speed);
      obstracles.updateBg(0, speed);
      // hero.move(0, -speed);
      break;
    case 39:
      background.updateBg(-speed);
      obstracles.updateBg(-speed);
      break;
    case 40:
      background.updateBg(0, -speed);
      obstracles.updateBg(0, -speed);
      // hero.move(0, speed);
      break;
  }
};

// const updateBg = (offset) => {
//   actualBG.tilePosition.x = actualBG.tilePosition.x + offset;
// };

soundEngine.fetures = features;
window.dispatchEvent(new CustomEvent("game-is-ready"));
