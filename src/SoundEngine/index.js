import { Howl, Howler } from "howler";
import Hero from "../Components/Hero";
import Obstracles from '../Components/Obstracles';

const soundLoops = ["backgroundLoop", "planeLoop"];

const defaltFadeCallbacs = {
  fadeIn: ({ sound, initialFade, maxFade, soundId }) => {
    sound.fade(initialFade, maxFade, 3, soundId);
  },
  fadeOut: ({ sound, initialFade, maxFade, soundId }) => {
    sound.fade(maxFade, initialFade, 3, soundId);
  },
};
const SOUNDS_SORCE = [
  {
    name: soundLoops[0],
    url: "./assets/sounds/Background.mp3",
    initialFade: 0.2,
    maxFade: 0.5,
    loop: true,
  },
  {
    name: soundLoops[1],
    url: "./assets/sounds/Plane.mp3",
    minFade:0,
    initialFade: 0,
    maxFade: 0.1,
  },
];
export default class SoundEngine {
  #sounds = [];
  #muteButton = null;
  #features = {};
  constructor() {
    window.addEventListener("load", (event) => {
      SOUNDS_SORCE.forEach(
        ({
          url,
          initialFade,
          maxFade,
          fadeIn = defaltFadeCallbacs.fadeIn,
          fadeOut = defaltFadeCallbacs.fadeOut,
          loop,
          name,
        }) => {
          const sound = new Howl({
            src: [url],
            loop,
          });
          const soundId = sound.play();
          const soundObject = {
            sound: sound,
            soundId: soundId,
            initialFade: initialFade,
            maxFade: maxFade,
            fadeIn: fadeIn,
            fadeOut: fadeOut,
          };
          soundObject.sound.fade(0, initialFade, 0, soundId);
          this.#sounds[name] = soundObject;
        }
      );
      this.#muteButton = document.querySelector("#mute");
      // may use Status class here
      window.addEventListener(
        "game-is-ready",
        () => this.attachGameListeners(),
        { once: true }
      );
    });
  // TODO : add sounds router like next line to catch the same sound and not loading the assets again
    this.crash =  new Howl({
      src: ["./assets/sounds/ExplosionSmall.wav"],
      loop: false,
    });
  }

  get sounds() {
    return this.#sounds;
  }

  /**
   * @param {any} features
   */
  set fetures(features) {
    this.#features = features;
  }

  get features() {
    return this.#features;
  }

  attachGameListeners() {
    window.addEventListener("keydown", ({ keyCode }) => {
      if (
        keyCode === 37 ||
        keyCode === 38 ||
        keyCode === 39 ||
        keyCode === 40
      ) {
        this.#sounds[soundLoops[0]].fadeOut(this.#sounds[soundLoops[0]]);
        this.#sounds[soundLoops[1]].fadeIn(this.#sounds[soundLoops[1]]);
      }
    });

    window.addEventListener("keyup", () => {
      this.#sounds[soundLoops[0]].fadeIn(this.#sounds[soundLoops[0]]);
      this.#sounds[soundLoops[1]].fadeOut(this.#sounds[soundLoops[1]]);
    });

    this.#muteButton.onclick = () => {
      this.muted = !this.muted;
      document.querySelector("#toggle-sound").classList.toggle("sound-mute");

      Object.keys(this.#sounds).forEach((key) => {
        const { sound } = this.#sounds[key];
        sound.mute(this.muted)
      });
    };

    this.features.hero.on(Hero.events.CRASH, () => this.onCrash());
    this.features.hero.on(Hero.events.DESTROYED, () => this.onDestroy());
    this.features.obstracles.on(Obstracles.events.DESTROYED, () => this.onDestroy());
    this.features.obstracles.on(Obstracles.events.CRASH, () => this.onCrash());
  }

  onCrash() {
    if(this.crash.playing()){
      setTimeout(() => {
        const soundId = this.crash.play();
        const fade = this.crash.fade(0, 0.5, 2, soundId);
      }, 300);
      return ;
    }
    const soundId = this.crash.play();
    const fade = this.crash.fade(0, 0.5, 2, soundId);
  }

  onDestroy() {
    const sound = new Howl({
      src: ["./assets/sounds/ExplosionBig.wav"],
      loop: false,
    });
    const soundId = sound.play();
    const fade = sound.fade(0, 1.2, 2, soundId);
  }
}
