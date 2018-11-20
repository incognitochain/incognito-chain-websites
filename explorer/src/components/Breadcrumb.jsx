import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Breadcrumb extends React.Component {
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
        <ul>
          {
            urls.map(
              url => (
                <li key={url.name}>
                  {url.url ? <Link to={url.url}>{url.name}</Link> : url.name}
                </li>
              ),
            )
          }
        </ul>
      </div>
    );
  }
}

export default Breadcrumb;
