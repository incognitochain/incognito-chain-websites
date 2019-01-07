export default (state = {}, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      document.title = 'Portal - constant.money';
      return state;
    }
    default: {
      return state;
    }
  }
};
