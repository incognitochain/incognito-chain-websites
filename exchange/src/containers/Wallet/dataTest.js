const tableData = [
  {
    "symbolName": "Constant",
    "symbolCode": "CST",
    "totalBalance": 100,
    "availableBalance": 1,
    "inOrder": 0,
    "constantValue": 100,
    "key": 0
  },
  {
    "symbolName": "Token A",
    "symbolCode": "ATK",
    "totalBalance": 600,
    "availableBalance": 400,
    "inOrder": 200,
    "constantValue": 0.0084,
    "key": 1
  },
  {
    "symbolName": "Token B",
    "symbolCode": "BTK",
    "totalBalance": 1200,
    "availableBalance": 800,
    "inOrder": 400,
    "constantValue": 0.0168,
    "key": 2
  },
  {
    "symbolName": "Token C",
    "symbolCode": "CTK",
    "totalBalance": 1200,
    "availableBalance": 800,
    "inOrder": 400,
    "constantValue": 0.0168,
    "key": 3
  },
  {
    "symbolName": "Token D",
    "symbolCode": "DTK",
    "totalBalance": 1200,
    "availableBalance": 800,
    "inOrder": 400,
    "constantValue": 0.0168,
    "key": 4
  },
];

const sortOption = {};
class dataTest {
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
    if(this.size > tableData.length)
      this.size = tableData.length;

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
export default dataTest;
