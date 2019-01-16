import React from 'react';
import PropTypes from 'prop-types';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';
import cn from '@sindresorhus/class-names';

class DemoPreview extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
      PropTypes.string,
    ]).isRequired,
    code: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  renderCode = (type, code, name) => {
    if (code) {
      if (type === 'text') {
        if (Array.isArray(code)) {
          return (
            <tr key={`${type}${code}${name}`}>
              <td valign="top">{name}</td>
              <td>
                {code.map(c => <div key={c}><code>{`className="${c}"`}</code></div>)}
              </td>
            </tr>
          )
        }
        return (
          <tr key={`${type}${code}${name}`}>
            <td valign="top">{name}</td>
            <td><div><code>{`className="${code}"`}</code></div></td>
          </tr>
        );
      }
      if (type === 'code') {
        if (Array.isArray(code)) {
          return (
            <tr key={`${type}${code}${name}`}>
              <td valign="top">{name || 'code'}</td>
              <td>
                {code.map(c => <div key={c}><pre>{c}</pre></div>)}
              </td>
            </tr>
          )
        }
        return (
          <tr key={`${type}${code}${name}`}>
            <td valign="top">{name || 'code'}</td>
            <td><pre>{code}</pre></td>
          </tr>
        )
      }
    }
    return null;
  }

  render() {
    const { children, type, code } = this.props;

    return (
      <div className={
        cn({
          'c-preview': true,
          'c-preview-inline': type === 'inline'
        })
      }>
        {children}
        <div className="c-preview-code">
          <table className="c-table c-table-list">
            <tbody>
              {code.length ? code.map(c => this.renderCode(c.type, c.code, c.name)) : ''}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default DemoPreview;
