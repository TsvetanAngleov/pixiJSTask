export default class Status {
  static #gameAllowed = false;

  static get gameAllowed() {
    return this.#gameAllowed;
  }
  static set gameAllowed(value) {
    this.#gameAllowed = value;
  }
}
