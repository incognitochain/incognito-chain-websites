import React from 'react';
// import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

class DemoSidebar extends React.Component {
  static propTypes = {
    // abc: PropTypes.object.isRequired,
    // abcd: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <ul className="c-list">
          <li><a href="/text">Text</a></li>
          <li><a href="/grid">Grid</a></li>
          <li><a href="/color">Color</a></li>
          <li><a href="/shadow">Shadow</a></li>
          <li><a href="/button">Button</a></li>
          <li><a href="/icons">Icons</a></li>
          <li><a href="/input">Input</a></li>
          <li><a href="/alert">Alert</a></li>
        </ul>
      </div>
    );
  }
}

export default DemoSidebar;
