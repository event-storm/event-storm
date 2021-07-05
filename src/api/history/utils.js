const historyOptions = { fromHistory: true };

const findDiff = (previous, next) => {
  for (let key in previous) {
    if (previous[key] !== next[key]) {
      return { key, previous: previous[key], next: next[key] };
    };
  };
}

export { historyOptions, findDiff };
