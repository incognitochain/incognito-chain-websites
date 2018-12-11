const rowStyle = {
  width: '100%',
  display: 'flex',
  flexFlow: 'row wrap',
};
const colStyle = {
  marginBottom: '16px',
};
const colStyle0 = {
};

const boxStyle0 = {
  margin: 0,
  padding: 0,
  border: 0,
  backgroundColor: 'unset'
};

const boxStyleBg = (bgImage, pos='right bottom') => {
  return ({
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: `${pos}`,
    height: 174,
    padding: '1.5rem'
  });
};

const gutter = 16;
const basicStyle = {
  rowStyle,
  colStyle,
  colStyle0,
  boxStyle0,
  boxStyleBg,
  gutter,
};

export default basicStyle;
