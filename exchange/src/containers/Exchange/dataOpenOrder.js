const dataList = [
  {
    "side": 'buy',
    "size": 0.4,
    "filled": 0,
    "price": 3994,
    "fee": 0.25,
    "status": "open",
    "key": 0
  },
  {
    "side": 'buy',
    "size": 0.5,
    "filled": 0.1,
    "price": 3980,
    "fee": 0.25,
    "status": "partial buy",
    "key": 1
  },
  {
    "side": 'sell',
    "size": 1,
    "filled": 0,
    "price": 3999,
    "fee": 0.25,
    "status": "open",
    "key": 2
  },
];

class Data {
  constructor(size) {
    this.size = size || 2000;
    this.datas = [];
  }
  

  dataModel(index) {
    return dataList[index];
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
    if(dataList && this.size > dataList.length)
      this.size = dataList.length;

    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

}
export default Data;
