import market from './Market';

const tableData2 = [
  {
    "symbolCode": "btcusdt",
    "last_price": 6440.59,
    "prevday_high": 6470.00,
    "prevday_low": 6393.55,
    "volumn": 9848,
    "prevday_volumn": 9748,
    "key": 0
  },
  {
    "symbolCode": "ethusdt",
    "last_price": 210.59,
    "prevday_high": 213.00,
    "prevday_low": 209.55,
    "volumn": 97143,
    "prevday_volumn": 107143,
    "key": 1
  },
  {
    "symbolCode": "xrpusdt",
    "last_price": 0.5275,
    "prevday_high": 0.5336,
    "prevday_low": 0.5156,
    "volumn": 60191196,
    "prevday_volumn": 60291496,
    "key": 2
  }
];

let tableData = [];
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

  async getData(){
    //market settings 
    let result = await market.getMarkets();
    let markets = {};
    for(let s of result){
      const { DisplayName, State, SymbolCode } = s;
      markets[SymbolCode] = { DisplayName, State };
    }

    //market datas
    result = await market.getSymbolRates("24h");
    let rates = [];
    for(let s of result){
      const setting = markets[s.SymbolCode];
      if(setting){console.log(setting);
        if(setting.State != "online"){
          break;
        }

        s.DisplayName = setting.DisplayName;
      }

      rates.push(s);
    }

    //console.log(markets, rates);
    return rates;
  }

  getAll() {
    this.getData().then(result => {
      tableData = result;

      if(tableData && this.size > tableData.length)
        this.size = tableData.length;
      
      if (this.datas.length < this.size) {
        for (let i = 0; i < this.size; i++) {
          this.getObjectAt(i);
        }
      }
      console.log(tableData, this.datas);
      return this.datas.slice();
    });
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
