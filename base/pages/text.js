import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Text of design system - constant.money";
const description = "Text - Design system of constant.money";

class Text extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color">
          <div className="row">
            <div className="col-12">
              <h2>Text</h2>
            </div>
            <div className="col-12">
              <h3>Typography</h3>
            </div>

          </div>
        </Layout>
      </>
    );
  }
}

export default Text;
