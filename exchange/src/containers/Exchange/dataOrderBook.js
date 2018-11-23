const dataOrderBook = [
  {
    "price": 6440.59,
    "amount": 0.444,
    "total": "612.34",
    "side": "buy",
    "key": 0
  },
  {
    "price": 6440.59,
    "amount": 0.1,
    "total": "195,349",
    "side": "buy",
    "key": 1
  },
  {
    "price": 6440.59,
    "amount": 0.1241,
    "total": "195,349",
    "side": "buy",
    "key": 2
  },
  {
    "price": 6440.59,
    "amount": 0.412,
    "total": "195,349",
    "side": "sell",
    "key": 3
  },
  {
    "price": 6440.59,
    "amount": 0.23,
    "total": "412.33",
    "side": "sell",
    "key": 4
  },
];

class Data {
  constructor(size) {
    this.size = size || 2000;
    this.datas = [];
  }
  

  dataModel(index) {
    return dataOrderBook[index];
  }

  getObjectAt(index) {
    if (index < 0 || index > this.size) {
      return undefined;
    }
    if (this.datas[index] === undefined) {
      this.datas[index] = this.dataModel(index);
    }
    return this.datas[index];
  }

  getAll() {
    if(dataOrderBook && this.size > dataOrderBook.length)
      this.size = dataOrderBook.length;

    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

}
export default Data;
