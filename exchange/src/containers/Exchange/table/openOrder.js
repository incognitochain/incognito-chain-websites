import React, { Component } from 'react';
import IntlMessages from '@/components/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  TimeCell
} from '@/components/tables/helperCells';
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
    title: <IntlMessages id="Exchange.OpenOrder.Side" />,
    key: 'Side',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.Side}>{obj.Side.toUpperCase()}</PriceSide>
    }
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Quantity" />,
    key: 'Quantity',
    width: 100,
    render: obj => renderCell(obj, 'TextCell', 'Quantity')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Price" />,
    key: 'Price',
    width: 100,
    render: obj => renderCell(obj, 'TextCell', 'Price')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Time" />,
    key: 'Time',
    className: 'text-right',
    width: 50,
    render: obj => renderCell(obj, 'TimeCell', 'Time')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Status" />,
    key: 'Status',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.Side}>{obj.Status.toUpperCase()}</PriceSide>
    }
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
