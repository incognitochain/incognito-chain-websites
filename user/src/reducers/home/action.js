import { APIGetCreator, APIPostCreator, APIFormCreator } from "store/api";
import { API_URL } from "../../constants";

export const apiLoadLoans = APIGetCreator({
  type: "API:LOAD_LOANS",
  url: API_URL.GET_LOAN_LIST
});

export const loadLoanList = (payload = {}) => {
  return {
    type: "HOME:GET_LOANS",
    payload
  };
};

export const updateLoans = (payload = []) => {
  return {
    type: "HOME:UPDATE_LOANS",
    payload
  };
};
