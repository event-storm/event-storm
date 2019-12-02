const wordRegex = /^\w/;

export const capitalize = word => word.replace(wordRegex, c => c.toUpperCase());

export const mapToObject = map => {
  const object = {};

  map.forEach((value, key) => object[key] = value.lastState);

  return object;
};

// NOTE:: more relevant comparison needed

export const isEqual = (next, prev) => Object.is(next, prev);
