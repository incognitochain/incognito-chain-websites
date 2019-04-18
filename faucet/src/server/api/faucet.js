import {callAPIService} from "../helpers/callApiService";

export async function sendSocialURL(socialURL = "") {
  if (!socialURL) return;
  let url = `/faucet/mint`;

  const result = await callAPIService({
    data: {
      URL: socialURL
    }, method: "POST", url
  });
  return result;
}

export async function getAvailableBalance() {
  let url = `/faucet/balance`;
  const result = await callAPIService({data: {}, method: "GET", url});
  return result;
}

export async function getWaitingList() {
  let url = `/faucet/waiting-list`
  const result = await callAPIService({method: "GET", url});
  return result;
}
