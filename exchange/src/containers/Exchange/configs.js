import React from 'react';
import clone from 'clone';
import IntlMessages from 'core-components/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from 'core-components/tables/helperCells';
import { RateTag } from './tableViews/style';

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
    title: <IntlMessages id="Market.pair" />,
    key: 'symbolCode',
    width: 200,
    render: obj => {
      return <span>{obj.symbolCode.toUpperCase()}</span>
    }
  },
  {
    title: <IntlMessages id="Market.lastPrice" />,
    key: 'last_price',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'last_price')
  },
  {
    title: "Change",
    key: 'prevday_volumn',
    width: 100,
    render: obj => {
      let className, percent = 0;
        if (obj.volumn > obj.prevday_volumn) {
          className = 'rateUp';
        } else if (obj.volumn < obj.prevday_volumn) {
          className = 'rateDown';
        }
        else {
          className = 'rateSame';
        }

        percent = ((obj.volumn-obj.prevday_volumn) / obj.volumn) * 100;
        return <RateTag className={className}>{percent > 0 ? "+" + percent.toFixed(2) : percent.toFixed(2)}{"%"}</RateTag>;
    }
  },
  {
    title: "High",
    key: 'prevday_high',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'prevday_high')
  },
  {
    title: "Low",
    key: 'prevday_low',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'prevday_low')
  },
  {
    title: "Volumn",
    key: 'volumn',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'volumn')
  }
];

const sortColumns = [
  { ...columns[0], sorter: true },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: false },
  { ...columns[4], sorter: false },
  { ...columns[5], sorter: true }
];


const tableinfo = 
{
  title: 'Sortable Table',
  value: 'sortView',
  columns: clone(sortColumns)
};
export { columns, tableinfo };
