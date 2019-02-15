import { ACTIONS } from "./action";

export default (
  state = {
    showDialog: false,
    showAlert: false,
    dialogContent: "",
    closeDialogFn: () => {},
    buttonDialogFn: () => {},
    dialogHideCloseButton: false
  },
  action
) => {
  switch (action.type) {
    case ACTIONS.SHOW_DIALOG: {
      if (action.payload) {
        return {
          ...state,
          showDialog: true,
          dialogContent: action.payload,
          buttonDialogFn: action.buttonDialogFn || function buttonDialogFn() {},
          closeDialogFn: action.closeDialogFn || function closeDialogFn() {},
          dialogTitle: action.title || "",
          dialogHideCloseButton: action.dialogHideCloseButton || false
        };
      }
      return state;
    }
    case ACTIONS.CLOSE_DIALOG: {
      return {
        ...state,
        showDialog: false,
        buttonDialogFn: () => {},
        closeDialogFn: () => {}
      };
    }
    default: {
      return state;
    }
  }
};
