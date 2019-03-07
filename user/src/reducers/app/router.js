export default (state = {}, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      document.title = 'User - Constant Chain';
      return state;
    }
    default: {
      return state;
    }
  }
};
