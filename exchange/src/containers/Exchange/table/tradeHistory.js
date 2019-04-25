import React, { Component } from 'react';
import IntlMessages from '@ui/utility/intlMessages';
import {
  DateCell,
  DateTimeCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  TimeCell
} from '@ui/tables/helperCells';
import TableWrapper, { PriceSide } from './style';

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'DateTimeCell':
      return DateTimeCell(value);
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
    key: 'Price',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.Side}>{obj.Price}</PriceSide>
    }
  },
  {
    title: <IntlMessages id="Exchange.TradeHistory.Quantity" />,
    key: 'Quantity',
    width: 100,
    render: obj => renderCell(obj, 'TextCell', 'Quantity')
  },
  {
    title: <IntlMessages id="Exchange.TradeHistory.Time" />,
    key: 'Time',
    className: 'text-right',
    width: 100,
    render: obj => renderCell(obj, 'DateTimeCell', 'Time')
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
