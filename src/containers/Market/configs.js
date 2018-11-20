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
    key: 'DisplayName',
    width: 200,
    render: obj => {
      return <span>{obj.DisplayName.toUpperCase()}</span>
    }
  },
  {
    title: <IntlMessages id="Market.lastPrice" />,
    key: 'Last',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'last_price')
  },
  {
    title: <IntlMessages id="Market.change" />,
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
        return <RateTag className={className}>{percent > 0 ? "+" + percent.toFixed(2) : percent.toFixed(2)}{"%"}</RateTag>;
    }
  },
  {
    title: <IntlMessages id="Market.high" />,
    key: 'High',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'High')
  },
  {
    title: <IntlMessages id="Market.low" />,
    key: 'Low',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'Low')
  },
  {
    title: <IntlMessages id="Market.volumn" />,
    key: 'Volumn',
    width: 100,
    render: object => renderCell(object, 'NumberCell', 'Volumn')
  }
];

const sortColumns = [
  { ...columns[0], sorter: true },
  // { ...columns[1], sorter: true },
  // { ...columns[2], sorter: true },
  // { ...columns[3], sorter: false },
  // { ...columns[4], sorter: false },
  // { ...columns[5], sorter: true }
];



const tableinfos = [
  {
    title: '1 day',
    value: 'day',
    columns: clone(sortColumns)
  },
  {
    title: '4H',
    value: 'fourHours',
    columns: clone(sortColumns)
  },
  {
    title: '1H',
    value: 'oneHour',
    columns: clone(sortColumns)
  }
];

export { columns, tableinfos };
