import Web3 from 'web3';
import dayjs from 'dayjs';

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

function cst2Cent() {
  const number = Number(this) * 100;
  if (Number.isNaN(number)) return '';
  return number.numberFormat();
}

function dateFormat(format) {
  return dayjs(this).format(format)
}

Number.prototype.commarize = commarize;
String.prototype.commarize = commarize;

Number.prototype.constant = constant;
String.prototype.constant = constant;

String.prototype.coinUnitFormat = coinUnitFormat;
Number.prototype.coinUnitFormat = coinUnitFormat;

String.prototype.etherToWei = etherToWei;
Number.prototype.etherToWei = etherToWei;

String.prototype.numberFormat = numberFormat;
Number.prototype.numberFormat = numberFormat;

String.prototype.cst2Cent = cst2Cent;
Number.prototype.cst2Cent = cst2Cent;

String.prototype.dateFormat = dateFormat;
