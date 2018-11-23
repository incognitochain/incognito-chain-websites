const dataTradeHistory = [
  {
    "price": 6440.59,
    "unit": 0.444,
    "side": "buy",
    "time": "19:53:49",
    "key": 0
  },
  {
    "price": 6440.59,
    "unit": 0.1,
    "side": "buy",
    "time": "19:53:49",
    "key": 1
  },
  {
    "price": 6440.59,
    "unit": 0.1241,
    "side": "sell",
    "time": "19:53:49",
    "key": 2
  },
  {
    "price": 6440.59,
    "unit": 0.412,
    "side": "sell",
    "time": "19:53:49",
    "key": 3
  },
  {
    "price": 6440.59,
    "unit": 0.23,
    "side": "buy",
    "time": "19:53:49",
    "key": 4
  },
  {
    "price": 6440.59,
    "unit": 0.234,
    "side": "buy",
    "time": "19:53:49",
    "key": 5
  }
];

class Data {
  constructor(size) {
    this.size = size || 2000;
    this.datas = [];
  }
  

  dataModel(index) {
    return dataTradeHistory[index];
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
    if(dataTradeHistory && this.size > dataTradeHistory.length)
      this.size = dataTradeHistory.length;

    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

}
export default Data;
