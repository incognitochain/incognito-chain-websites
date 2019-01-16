import React from 'react';
import PropTypes from 'prop-types';
import Sidebar from './Sidebar';
import cn from '@sindresorhus/class-names';

class DemoLayout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
    // title: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { title } = props;
    this.state = {
      // title
    };
  }

  render() {
    // const { title } = this.state;
    const { children, className } = this.props;
    return (
      <main className={cn('c-preview-layout', {
        [className]: true
      })}>
        <div className="container">
          <div className="row">
            <div className="col-12">
              {/* <h2>{title}</h2> */}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-md-3">
              <Sidebar />
            </div>
            <div className="col-12 col-md-9">
              {children}
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default DemoLayout;
