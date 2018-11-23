import React, { Component } from 'react';
import IntlMessages from '../../../components/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  TimeCell
} from '../../../components/tables/helperCells';
import TableWrapper, { PriceSide } from './style';

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value);
    case 'NumberCell':
      return NumberCell(value);
    case 'TimeCell':
      return TimeCell(value);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: <IntlMessages id="Exchange.TradeHistory.Price" />,
    key: 'price',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.side}>{obj.price}</PriceSide>
    }
  },
  {
    title: <IntlMessages id="Exchange.TradeHistory.Unit" />,
    key: 'unit',
    width: 100,
    render: obj => renderCell(obj, 'TextCell', 'unit')
  },
  {
    title: <IntlMessages id="Exchange.TradeHistory.Time" />,
    key: 'time',
    width: 100,
    render: obj => renderCell(obj, 'TextCell', 'time')
  }
];

export default class extends Component {
  
  render() {
    const dataSource = this.props.dataSource || this.props.dataList.getAll();
    //const columns = this.props.columns || this.props.tableInfo.columns;
    return (
      <TableWrapper
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        className="isoSimpleTable"
      />
    );
  }
}
