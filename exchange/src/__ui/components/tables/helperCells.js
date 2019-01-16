import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';

const renderDate = (date) => {
  console.log('Date:', date.toLocaleString());
  return date.toLocaleString();
}
const DateCell = data => <p>{renderDate(data)}</p>;
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const TextCell = text => <p>{text}</p>;
const NumberCell = number => <p className="text-right">{number.toLocaleString()}</p>;
const TimeCell = text => {
  let d = new Date(text);
  try{
    return <p className="text-right">{d.toLocaleTimeString('it-IT')}</p>
  }
  catch(e){
    return <p>Invalid</p>
  }
};

export {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  TimeCell,
  EditableCell,
  DeleteCell,
  FilterDropdown
};
