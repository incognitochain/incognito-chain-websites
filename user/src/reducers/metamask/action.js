import Web3 from "web3";

export const ACTIONS = {
  METAMASK_DETECTING: "METAMASK_DETECTING",
  METAMASK_DETECTED: "METAMASK_DETECTED"
};

let web3;

export const init = () => dispatch => {
  // detectLoadFromOpenBrowser
  web3 = window.web3;
};

export const detectInstalled = cb => dispatch => {
  if (typeof web3 !== "undefined" && web3.currentProvider.isMetaMask) {
    dispatch({
      type: ACTIONS.METAMASK_DETECTED,
      installed: true,
      unlocked: false,
      web3: {}
    });
    cb();
  } else {
    dispatch({
      type: ACTIONS.METAMASK_DETECTED,
      installed: false,
      unlocked: false,
      web3: {}
    });
  }
};

export const requestUnlockMetamask = (cb, showDialog) => async dispatch => {
  let web3App = {};

  if (window.ethereum) {
    let show = true;
    setTimeout(() => {
      if (show) showDialog();
    }, 1000);
    web3App = new Web3(window.ethereum);
    try {
      const accounts = await window.ethereum.enable();
      show = false;
      dispatch({
        type: ACTIONS.METAMASK_DETECTED,
        web3: web3App,
        unlocked: true,
        address: accounts[0]
      });
      cb();
    } catch (e) {
      console.error(e);
      dispatch({ type: ACTIONS.METAMASK_DETECTED, unlocked: false });
    }
  } else {
    web3App = new Web3();
    if (web3) {
      web3App.setProvider(web3.currentProvider);
    } else {
      web3App.setProvider(
        new Web3.providers.HttpProvider(
          "https://rinkeby.infura.io/v3/03f57f19c3e1478fb38fb91a8f680550"
        )
      );
    }
    dispatch({
      type: ACTIONS.METAMASK_DETECTED,
      unlocked: true,
      web3: web3App
    });
  }
};
