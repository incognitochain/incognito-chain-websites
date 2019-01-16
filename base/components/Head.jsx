import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

class DemoHead extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);
    const { title, description } = props;
    this.state = {
      title,
      description,
    };
  }

  render() {
    const { title, description } = this.state;
    return (
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content={description} />
        <link rel="apple-touch-icon" sizes="180x180" href="/static/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/static/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/static/icons/favicon-16x16.png" />
        <link rel="stylesheet" href="https://use.typekit.net/gez7skx.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=PT+Mono" />
      </Head>
    );
  }
}

export default DemoHead;
