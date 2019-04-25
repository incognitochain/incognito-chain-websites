import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';
import moment from "moment"

const renderDate = (date) => {
  date = moment(date)
  if (date.format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
    return date.format('HH:mm:ss')
  }
  return date.format('HH:mm:ss DD/MM/YYYY')
}
const renderDateTime = (date) => {
  date = moment(date)
  if (date.format('DD/MM/YYYY') == moment().format('DD/MM/YYYY')) {
    return date.format('HH:mm:ss')
  }
  return date.format('HH:mm:ss DD/MM/YYYY')
}
const DateCell = data => <p>{renderDate(data)}</p>;
const DateTimeCell = data => <p>{renderDateTime(data)}</p>;
const ImageCell = src => <ImageCellView src={src}/>;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const TextCell = text => <p>{text}</p>;
const NumberCell = number => <p className="text-right">{number.toLocaleString()}</p>;
const TimeCell = text => {
  let d = new Date(text);
  try {
    return <p className="text-right">{d.toLocaleTimeString('it-IT')}</p>
  } catch (e) {
    return <p>Invalid</p>
  }
};

export {
  DateCell,
  DateTimeCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  TimeCell,
  EditableCell,
  DeleteCell,
  FilterDropdown
};
