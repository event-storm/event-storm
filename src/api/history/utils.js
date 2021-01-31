const historyOptions = { fromHistory: true };

const findDiff = (previous, next) => {
  for(let index = 0; index < previous.length; index++) {
    if (previous[index] !== next[index]) {
      return { index, previous: previous[index], next: next[index] };
    }
  }
}

export { historyOptions, findDiff };
