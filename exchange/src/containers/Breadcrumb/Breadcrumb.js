import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Breadcrumb from '@ui/uielements/breadcrumb';

import "./Breadcrumb.scss";

class BreadcrumbBar extends React.Component {
  static propTypes = {
    urls: PropTypes.array.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { urls } = this.props;
    return (
        <div className="breadcrumb">
            <Breadcrumb >
                {
                urls.map(
                    url => (
                    <Breadcrumb.Item key={url.name}>
                        {url.url ? <Link to={url.url}>{url.name}</Link> : url.name}
                    </Breadcrumb.Item>
                    ),
                )
                }
            </Breadcrumb>
      </div>
    );
  }
}

export default BreadcrumbBar;
