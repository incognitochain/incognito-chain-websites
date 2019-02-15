import Web3 from 'web3';

function commarize(rawMin) {
  const min = rawMin || 1e3;
  if (this >= min) {
    const units = ['k', 'M', 'B', 'T', 'P', 'E', 'Z', 'Y'];
    const order = Math.floor(Math.log(this) / Math.log(1000));
    const unitname = units[(order - 1)];
    const num = Math.floor((this / 1000) ** order);
    return `${(`${num}.${this.toString().substr(1, 3)}`).numberFormat()}${unitname}`;
  }
  return this.toLocaleString();
}

function coinUnitFormat(type) {
  if (type === 'ETH') {
    return Web3.utils.fromWei(this.toString(), 'ether');
  }
  return this;
}

function etherToWei() {
  return Web3.utils.toWei(this);
}

function numberFormat() {
  const number = Number(this);
  if (Number.isNaN(number)) {
    return this;
  }
  if (number === parseInt(number, 10)) {
    return number;
  }
  return number.toFixed(2);
}

function constant() {
  const number = Number(this) / 100;
  if (Number.isNaN(number)) return '';
  return number.numberFormat();
}

function autoLabel() {
  return this.replace('u s d', 'USD')
    .replace('g o v', 'GOV')
    .replace('d c b', 'DCB')
    .replace('c m b', 'CMB')
    .replace('i d', 'ID');
}

Number.prototype.commarize = commarize; // eslint-disable-line
String.prototype.commarize = commarize; // eslint-disable-line

Number.prototype.constant = constant; // eslint-disable-line
String.prototype.constant = constant; // eslint-disable-line

String.prototype.coinUnitFormat = coinUnitFormat; // eslint-disable-line
Number.prototype.coinUnitFormat = coinUnitFormat; // eslint-disable-line

String.prototype.etherToWei = etherToWei; // eslint-disable-line
Number.prototype.etherToWei = etherToWei; // eslint-disable-line

String.prototype.numberFormat = numberFormat; // eslint-disable-line
Number.prototype.numberFormat = numberFormat; // eslint-disable-line

String.prototype.autoLabel = autoLabel; // eslint-disable-line
