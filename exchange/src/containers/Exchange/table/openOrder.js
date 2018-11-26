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
    key: 'side',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.side}>{obj.side}</PriceSide>
    }
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Size" />,
    key: 'size',
    className: 'text-right',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'size')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Filled" />,
    key: 'filled',
    className: 'text-right',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'filled')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Price" />,
    key: 'price',
    className: 'text-right',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'price')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Fee" />,
    key: 'fee',
    className: 'text-right',
    width: 50,
    render: obj => renderCell(obj, 'NumberCell', 'fee')
  },
  {
    title: <IntlMessages id="Exchange.OpenOrder.Status" />,
    key: 'status',
    width: 100,
    render: obj => {
      return <PriceSide className={obj.side}>{obj.status}</PriceSide>
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
