import actions from './actions';
//import allMails from '@/containers/Voting/fakeData';
//import voting from '@/services/Voting';

const initState = {
  allMails: [],
  tag: undefined,
  selectedMail: -1,
  filterAttr: { },
  composeMail: false,
  replyMail: false,
  searchString: ''
};

export default function mailReducer(state = initState, action) {

  switch (action.type) {
    case actions.STORE_MAIL:
      return {
        ...state,
        allMails: action.mails || []
      }
    case actions.FILTER_ATTRIBUTE:
      return {
        ...state,
        composeMail: false,
        replyMail: false,
        selectedMail: -1,
        filterAttr: { ...action.filterAttr }
      };
    case actions.SELECTED_MAIL:
      return {
        ...state,
        replyMail: false,
        selectedMail: action.selectedMail,
        allMails: action.allMails
      };
    case actions.REPLY_MAIL:
      return {
        ...state,
        replyMail: action.replyMail
      };
    case actions.SEARCH_STRING:
      return {
        ...state,
        searchString: action.searchString
      };
    default:
      return state;
  }
}
