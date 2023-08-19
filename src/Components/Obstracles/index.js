import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import getRandomInt from '../../utils/getRandomInt';
import initArray from '../../utils/initArray';
import PlaneObstracle from '../PlaneObstracle';

const PRIVET_EVENTS ={
  OUT_OF_OBSTRACLES: 'out_of_obstracles'
}

const EVENTS = {
  CRASH: 'crash',
  DESTROYED: 'destroyed',
  HIT: 'hit',
};

const OBSTRECAL_COUNT = 20;

// TODO: add torpedos
export default class Obstracles extends PIXI.Container {
  #obstracles = [];
  #spriteSheets = {};
  constructor({ stage, spriteSheets }) {
    super();
    this.#spriteSheets = spriteSheets;
    this.createObstracles();
    this.addTo(stage);
    this.on(PRIVET_EVENTS.OUT_OF_OBSTRACLES,this.createObstracles);
  }

  static get events() {
    return EVENTS;
  }

  async addTo(stage) {
    stage.addChild(this);
  }

  async createObstracles() {
    initArray(OBSTRECAL_COUNT, () => {
      PIXI.Assets.load(PlaneObstracle.randomAssetURL).then((texture) => {
        const { frame } = texture;
        const rotate = 12;
        const D8 = PIXI.groupD8;
        const h = D8.isVertical(rotate)
          ? texture.frame.width
          : texture.frame.height;
        const w = D8.isVertical(rotate)
          ? texture.frame.height
          : texture.frame.width;
        const crop = new PIXI.Rectangle(texture.frame.x, texture.frame.y, w, h);
        const trim = crop;
        const rotatedTexture = new PIXI.Texture(
          texture.baseTexture,
          frame,
          crop,
          trim,
          rotate
        );

        const obstracle = new PlaneObstracle({
          texture: rotatedTexture,
          x: getRandomInt(1000, 10000),
          y: getRandomInt(0, 800),
          spriteSheets: { explosion: this.#spriteSheets.explosion },
        });

        this.#obstracles.push(obstracle);
        obstracle.on(PlaneObstracle.events.CRASH,()=>this.emit(EVENTS.CRASH));
        obstracle.on(PlaneObstracle.events.DESTROYED,()=>this.emit(EVENTS.DESTROYED));
        obstracle.once(PlaneObstracle.events.REMOVED,()=>this.onRemoveObstracle(obstracle));
        this.addChild(obstracle);
      });
    });
  }

  updateBg = (offsetX, offsetY) => {
    offsetX && (this.x = this.x + offsetX);
    offsetY && (this.y = this.y + offsetY);
  };

  onRemoveObstracle(obstracle){
    this.removeChild(obstracle);
    const indexToRemove = this.#obstracles.findIndex(
      (child) => child.id === obstracle.id
    );
    indexToRemove && this.#obstracles.splice(indexToRemove, 1);
    if(this.#obstracles?.length===0)
    this.emit(PRIVET_EVENTS.OUT_OF_OBSTRACLES);
  }

 
}
