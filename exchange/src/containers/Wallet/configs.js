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
import Button from 'core-components/uielements/button';
import IsoButton from 'core-components/uielements/button';

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
    title: <IntlMessages id="Wallet.symbolName" />,
    key: 'symbolName',
    width: 200,
    render: obj => {
      return <span>{obj.symbolName.toUpperCase()}</span>
    }
  },
  {
    title: <IntlMessages id="Wallet.symbolCode" />,
    key: 'symbolCode',
    width: 200,
    render: obj => {
      return <span>{obj.symbolCode.toUpperCase()}</span>
    }
  },
  {
    title: <IntlMessages id="Wallet.totalBalance" />,
    key: 'totalBalance',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'totalBalance')
  },
  {
    title: <IntlMessages id="Wallet.availableBalance" />,
    key: 'availableBalance',
    width: 80,
    render: obj => renderCell(obj, 'NumberCell', 'availableBalance')
  },
  {
    title: <IntlMessages id="Wallet.inOrder" />,
    key: 'inOrder',
    width: 80,
    render: obj => renderCell(obj, 'NumberCell', 'inOrder')
  },
  {
    title: <IntlMessages id="Wallet.constantValue" />,
    key: 'constantValue',
    width: 100,
    render: obj => renderCell(obj, 'NumberCell', 'constantValue')
  },
  {
    title: "",
    key: 'symbolCode',
    width: 100,
    render: obj => {
      return (
        <div>
          <Button type="primary" className="btn">
            <IntlMessages id="Wallet.deposit" />
          </Button>

          <Button type="primary" className="btn" >
            <IntlMessages id="Wallet.withdraw" />
          </Button>

          <Button type="primary" className="btn" >
            <IntlMessages id="Wallet.exchange" />
          </Button>
        </div>
      );
    }
  }
];

const sortColumns = [
  { ...columns[0], sorter: false },
  { ...columns[1], sorter: false },
  { ...columns[2], sorter: true },
  { ...columns[3], sorter: true },
  { ...columns[4], sorter: true },
  { ...columns[5], sorter: true },
  { ...columns[6], sorter: false }
];


const tableinfo = 
{
  title: 'Sortable Table',
  value: 'sortView',
  columns: clone(sortColumns)
};
export { columns, tableinfo };
