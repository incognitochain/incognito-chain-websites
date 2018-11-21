const tableData = [
  {
    "symbolCode": "btcusdt",
    "last_price": 6440.59,
    "prevday_high": 6470.00,
    "prevday_low": 6393.55,
    "volume": 9848,
    "prevday_volume": 9748,
    "key": 0
  },
  {
    "symbolCode": "ethusdt",
    "last_price": 210.59,
    "prevday_high": 213.00,
    "prevday_low": 209.55,
    "volume": 97143,
    "prevday_volume": 107143,
    "key": 1
  },
  {
    "symbolCode": "xrpusdt",
    "last_price": 0.5275,
    "prevday_high": 0.5336,
    "prevday_low": 0.5156,
    "volume": 60191196,
    "prevday_volume": 60291496,
    "key": 2
  }
];

const sortOption = {};
class Data {
  constructor(size) {
    this.size = size || 2000;
    this.datas = [];
    this.sortKey = null;
    this.sortDir = null;
  }
  dataModel(index) {
    return tableData[index];
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
    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

  getSize() {
    return this.size;
  }
  getSortAsc(sortKey) {console.log('getSortAsc');
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'ASC';
    return this.datas.sort(this.sort);
  }
  getSortDesc(sortKey) {console.log('getSortDesc');
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'DESC';
    return this.datas.sort(this.sort);
  }
  sort(optionA, optionB) {console.log('sort', optionA[sortOption.sortKey], optionB[sortOption.sortKey]);

    const valueA = isNaN(optionA[sortOption.sortKey]) ? optionA[sortOption.sortKey].toUpperCase() : optionA[sortOption.sortKey];
    const valueB = isNaN(optionB[sortOption.sortKey]) ? optionB[sortOption.sortKey].toUpperCase() : optionB[sortOption.sortKey];
    let sortVal = 0;
    if (valueA > valueB) {
      sortVal = 1;
    }
    if (valueA < valueB) {
      sortVal = -1;
    }
    if (sortVal !== 0 && sortOption.sortDir === 'DESC') {
      return sortVal * (-1);
    }
    return sortVal;
  }
}
export default Data;
