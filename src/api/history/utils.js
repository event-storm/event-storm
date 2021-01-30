const historyOptions = { fromHistory: true };

const collectState = (...models) => models.map(model => model.getState());

const findDiff = (previous, next) => {
  for(let index = 0; index < previous.length; index++) {
    if (previous[index] !== next[index]) {
      return { index, previous: previous[index], next: next[index] };
    }
  }
}

export { historyOptions, collectState, findDiff };
