class Data {
  constructor(size, dataSource) {
    this.size = size || 2000;
    this.datas = [];
    this.dataList = dataSource;
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
    if(this.dataList && this.size > this.dataList.length)
      this.size = this.dataList.length;

    if (this.datas.length < this.size) {
      for (let i = 0; i < this.size; i++) {
        this.getObjectAt(i);
      }
    }
    return this.datas.slice();
  }

}
export default Data;
