const tableData = [
  {
    "SymbolName": "Constant",
    "SymbolCode": "CST",
    "TotalBalance": 100,
    "AvailableBalance": 1,
    "InOrder": 0,
    "ConstantValue": 100,
    "key": 0
  },
  {
    "SymbolName": "Token A",
    "SymbolCode": "ATK",
    "TotalBalance": 600,
    "AvailableBalance": 400,
    "InOrder": 200,
    "ConstantValue": 0.0084,
    "key": 1
  },
  {
    "SymbolName": "Token B",
    "SymbolCode": "BTK",
    "TotalBalance": 1200,
    "AvailableBalance": 800,
    "InOrder": 400,
    "ConstantValue": 0.0168,
    "key": 2
  },
  {
    "SymbolName": "Token C",
    "SymbolCode": "CTK",
    "TotalBalance": 1200,
    "AvailableBalance": 800,
    "InOrder": 400,
    "ConstantValue": 0.0168,
    "key": 3
  },
  {
    "SymbolName": "Token D",
    "SymbolCode": "DTK",
    "TotalBalance": 1200,
    "AvailableBalance": 800,
    "InOrder": 400,
    "ConstantValue": 0.0168,
    "key": 4
  },
];

const sortOption = {};
export default class Data {
  constructor(size, dataSource) {
    this.size = size || 2000;
    this.dataList = dataSource;
    this.datas = [];
    this.sortKey = null;
    this.sortDir = null;
  }
  dataModel(index) {
    return this.dataList[index];
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
    if(this.size > this.dataList.length)
      this.size = this.dataList.length;
      
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
  getSortAsc(sortKey) {
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'ASC';
    return this.datas.sort(this.sort);
  }
  getSortDesc(sortKey) {
    sortOption.sortKey = sortKey;
    sortOption.sortDir = 'DESC';
    return this.datas.sort(this.sort);
  }
  sort(optionA, optionB) {

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