export default (state = {}, action) => {
  switch (action.type) {
    case '@@router/LOCATION_CHANGE': {
      document.title = 'Incognito Explorer';
      return state;
    }
    default: {
      return state;
    }
  }
};
