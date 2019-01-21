export const ACTIONS = {
  SHOW_ALERT: 'SHOW_ALERT',
  CLOSE_ALERT: 'CLOSE_ALERT',

  SHOW_DIALOG: 'SHOW_DIALOG',
  CLOSE_DIALOG: 'CLOSE_DIALOG',

  CALLING_INTERNAL_API: 'CALLING_INTERNAL_API',
  CALLED_INTERNAL_API: 'CALLED_INTERNAL_API',
};

export const DIALOG = {
  STATUS: {
    SUCCESS: 'SUCCESS',
    WARNING: 'WARNING',
    ERROR: 'ERROR',
  },
};

export const setNotFound = () => ({ type: 'APP_NOTFOUND_SET' });
export const clearNotFound = () => ({ type: 'APP_NOTFOUND_CLEAR' });

export const closeDialog = () => ({ type: ACTIONS.CLOSE_DIALOG });

export const showDialog = (content, closeDialogFn) => (dispatch) => {
  dispatch({ type: ACTIONS.SHOW_DIALOG, payload: content, closeDialogFn });
};


export const internalAPI = ({
  path, qs, method, data = {}, successFn, errorFn,
}) => (dispatch) => {
  dispatch({ type: ACTIONS.CALLING_INTERNAL_API });
  axios({
    url: `${process.env.internalAPI}${path}`,
    method,
    data,
    params: qs,
  }).then((res) => {
    dispatch({ type: ACTIONS.CALLED_INTERNAL_API });
    successFn(res);
  }).catch((e) => {
    dispatch({ type: ACTIONS.CALLED_INTERNAL_API });
    errorFn(e);
  });
};
