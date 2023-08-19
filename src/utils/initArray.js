const  initArray = (size, element) => {
  const array = new Array(size);

  for (let i = 0; i < size; i++) {
    const outPutElement = typeof element === "function" ? element(i) : element;
    array[i] = typeof outPutElement !== "undefined" ? outPutElement : i;
  }
};

export default initArray;