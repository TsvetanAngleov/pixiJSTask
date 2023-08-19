export default class AsyncAction {
  #completePromise = () => {};
  #promise = new Promise((resolve) => (this.#completePromise = resolve));
  constructor() {
    this.completed = false;
  }

  complete(data){
    this.completed = true;
    this.#completePromise(data);
  }

  wait(){
    return this.#promise;
  }
}
