export default (state = {}, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      document.title = 'Constant Portal';
      return state;
    }
    default: {
      return state;
    }
  }
};
