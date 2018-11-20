import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class DynamicImport extends React.Component {
  static propTypes = {
    load: PropTypes.func.isRequired,
    children: PropTypes.any.isRequired,
    loading: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      loading,
    } = this.props;
    this.state = {
      component: loading,
    };
  }

  componentDidMount() {
    const { load } = this.props;
    load()
      .then((component) => {
        this.setState(() => ({
          component: component.default ? component.default : component,
        }));
      });
  }

  render() {
    const { component } = this.state;
    const { children } = this.props;
    return children(component);
  }
}

export default connect(null, null)(DynamicImport);
