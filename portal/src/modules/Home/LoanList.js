import React, { Component } from 'react';
import {
  TableStyle,
} from "@/styles/custom.style";
//import Table from '@ui/uielements/table';
import { Table } from 'antd';

import Tabs, { TabPane } from '@ui/uielements/tabs';

const dataSource = [{
  key: '1',
  name: 'Mike',
  age: 32,
  address: '10 Downing Street'
}, {
  key: '2',
  name: 'John',
  age: 42,
  address: '10 Downing Street'
}];

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}];
class LoanList extends Component {
  render(){
    return (
      <TableStyle className="isoLayoutContent">
        <Table dataSource={dataSource} columns={columns} />
      </TableStyle>
    );
  }
}
export default LoanList;
