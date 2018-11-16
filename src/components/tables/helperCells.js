import React from 'react';
import ImageCellView from './imageCell';
import DeleteCell from './deleteCell';
import EditableCell from './editableCell';
import FilterDropdown from './filterDropdown';

const DateCell = data => <p>{data.toLocaleString()}</p>;
const ImageCell = src => <ImageCellView src={src} />;
const LinkCell = (link, href) => <a href={href ? href : '#'}>{link}</a>;
const TextCell = text => <p>{text}</p>;
const NumberCell = number => <p className="text-right">{number.toLocaleString()}</p>;

export {
  DateCell,
  ImageCell,
  LinkCell,
  TextCell,
  NumberCell,
  EditableCell,
  DeleteCell,
  FilterDropdown
};
