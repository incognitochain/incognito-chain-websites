import storelib from 'store';
import CryptoJS from 'crypto-js';
import Log from '@/services/log';

const STORE_KEY = 'constant_3dbedb125518bf5f77fce8230d9d7383';

function getStore() {
  const data = storelib.get(STORE_KEY);
  if (!data) {
    return { isEmpty: true };
  }
  try {
    const localStore = CryptoJS.AES.decrypt(data, '8aaac3acc61f4c60fe8c073e7e233a3d').toString(CryptoJS.enc.Utf8);
    const jsonLocalStore = JSON.parse(localStore);
    return jsonLocalStore;
  } catch (e) {
    return { isEmpty: true, e };
  }
}

function setStore(data) {
  const store = data;
  if (Object.prototype.hasOwnProperty.call(store, 'isEmpty')) {
    delete store.isEmpty;
  }
  Log.Info('localstore - set store', store);
  const jsonStore = JSON.stringify(store);
  const encrypted = CryptoJS.AES.encrypt(jsonStore, '8aaac3acc61f4c60fe8c073e7e233a3d');
  storelib.set(STORE_KEY, encrypted.toString());
}

class LocalStore {
  static store = getStore();

  constructor() {
    if (LocalStore.store.isEmpty) {
      LocalStore.store = {};
      setStore(LocalStore.store);
    }
  }

  static fetchStore() {
    LocalStore.store = getStore();
  }

  static set(key, data) {
    LocalStore.fetchStore();
    LocalStore.store[key] = data;
    setStore(LocalStore.store);
    return true;
  }

  static save = LocalStore.set;

  static get(key) {
    LocalStore.fetchStore();
    if (LocalStore.store.isEmpty) {
      return undefined;
    }
    const data = LocalStore.store[key];
    if (!data) {
      return undefined;
    }
    return data;
  }

  static remove(key) {
    LocalStore.fetchStore();
    if (Object.prototype.hasOwnProperty.call(LocalStore.store, key)) {
      delete LocalStore.store[key];
    }
    setStore(LocalStore.store);
    return true;
  }
}

export default LocalStore;
