import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Inputs of design system - constant.money";
const description = "Input - Design system of constant.money";

class Icons extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color">
          <div className="row">
            <div className="col-12">
              <h3>Icons</h3>
            </div>
            <div className="col-12">
              <h3>Basic</h3>
            </div>

          </div>
        </Layout>
      </>
    );
  }
}

export default Icons;
