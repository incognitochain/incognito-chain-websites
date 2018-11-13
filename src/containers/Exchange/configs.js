import React from 'react';
import clone from 'clone';
import IntlMessages from '../../components/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell
} from '../../components/tables/helperCells';

const renderCell = (object, type, key) => {
  const value = object[key];
  switch (type) {
    case 'ImageCell':
      return ImageCell(value);
    case 'DateCell':
      return DateCell(value);
    case 'LinkCell':
      return LinkCell(value);
    default:
      return TextCell(value);
  }
};

const columns = [
  {
    title: "Pair",
    key: 'symbol_code',
    width: 200,
    render: object => renderCell(object, 'TextCell', 'symbol_code')
  },
  {
    title: "Last",
    key: 'last_price',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'last_price')
  },
  {
    title: "High",
    key: 'prevday_high',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'prevday_high')
  },
  {
    title: "Low",
    key: 'prevday_low',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'prevday_low')
  },
  {
    title: "Volumn",
    key: 'volumn',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'volumn')
  },
  {
    title: "BV",
    key: 'prevday_volumn',
    width: 100,
    render: object => renderCell(object, 'TextCell', 'prevday_volumn')
  }
];
const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
  { ...columns[4], sorter: true }
];


const tableinfo = 
{
  title: 'Sortable Table',
  value: 'sortView',
  columns: clone(sortColumns)
};
export { columns, tableinfo };
