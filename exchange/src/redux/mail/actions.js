const mailActions = {
  STORE_MAIL: 'STORE_MAIL',
  FILTER_ATTRIBUTE: 'FILTER_ATTRIBUTE',
  SELECTED_MAIL: 'SELECTED_MAIL',
  REPLY_MAIL: 'REPLY_MAIL',
  SEARCH_STRING: 'SEARCH_STRING',
  storeMails: mails => {
    return {
      type: mailActions.STORE_MAIL,
      mails
    };
  },
  filterAction: newFilterAttr => {
    return (dispatch, getState) => {
      const filterAttr = getState().Mails.filterAttr;
      if (newFilterAttr) {
        if (newFilterAttr.bucket) {
          filterAttr.bucket = newFilterAttr.bucket;
          filterAttr.tag = newFilterAttr.tag;
        } else if (newFilterAttr.tag) {
          filterAttr.tag = newFilterAttr.tag;
        }
      }
      dispatch({
        type: mailActions.FILTER_ATTRIBUTE,
        filterAttr
      });
    };
  },
  selectMail: (selectedMail, mails) => {
    return (dispatch, getState) => {
      let allMails = getState().Mails.allMails;
      if(!allMails) allMails = mails;

      allMails[
        allMails.findIndex(mail => mail.ID === selectedMail)
      ].read = true;

      dispatch({
        type: mailActions.SELECTED_MAIL,
        selectedMail,
        allMails
      });
    };
  },
  changeReplyMail: replyMail => ({
    type: mailActions.REPLY_MAIL,
    replyMail
  }),
  changeSearchString: searchString => ({
    type: mailActions.SEARCH_STRING,
    searchString
  })
};
export default mailActions;
