import React from 'react';
import clone from 'clone';
import IntlMessages from '../../components/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from '../../components/tables/helperCells';
import { PriceSide } from './tableViews/style';

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

const sortColumns = [
  { ...columns[0] },
  { ...columns[1] },
  { ...columns[2] }
];


const tableinfo = 
{
  title: 'Sortable Table',
  value: 'sortView',
  columns: clone(sortColumns)
};
export { columns, tableinfo };
