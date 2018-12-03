import React from 'react';
import clone from 'clone';
import IntlMessages from '@ui/utility/intlMessages';
import {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell
} from '@ui/tables/helperCells';
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
    title: <IntlMessages id="Market.Pair" />,
    key: 'DisplayName',
    width: 200,
    render: obj => {
      return <span>{obj.DisplayName.toUpperCase()}</span>
    }
  },
  {
    title: <IntlMessages id="Market.LastPrice" />,
    key: 'Last',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'Last')
  },
  {
    title: <IntlMessages id="Market.Change" />,
    key: 'PrevPrice',
    width: 100,
    render: obj => {
      let className, percent = 0;
        if (obj.Last > obj.PrevPrice) {
          className = 'rateUp';
        } else if (obj.Last < obj.PrevPrice) {
          className = 'rateDown';
        }
        else {
          className = 'rateSame';
        }

        percent = ((obj.Last-obj.PrevPrice) / obj.Last) * 100;
        if(isNaN(percent)){
          return <RateTag className={className}>%</RateTag>
        }
        else{
          return <RateTag className={className}>{percent > 0 ? "+" + percent.toFixed(2) : percent.toFixed(2)}{"%"}</RateTag>;
        }
    }
  },
  {
    title: <IntlMessages id="Market.High" />,
    key: 'High',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'High')
  },
  {
    title: <IntlMessages id="Market.Low" />,
    key: 'Low',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'Low')
  },
  {
    title: <IntlMessages id="Market.Volume" />,
    key: 'Volume',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'Volume')
  }
];

const sortColumns = [
  { ...columns[0], sorter: false },
  { ...columns[1], sorter: true },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
  { ...columns[4], sorter: true },
  { ...columns[5], sorter: true }
];



const tableinfos = [
  {
    title: 'One day',
    value: '24h',
    columns: clone(sortColumns)
  },
  {
    title: '4H',
    value: '4h',
    columns: clone(sortColumns)
  },
  {
    title: '1H',
    value: '1h',
    columns: clone(sortColumns)
  }
];

export { columns, tableinfos };
