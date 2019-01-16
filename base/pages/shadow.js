import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Shadows of design system - constant.money";
const description = "Shadow - Design system of constant.money";

class Shadow extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color" className="c-bg-gray-100">
          <div className="row">
            <div className="col-12">
              <h2>Shadow</h2>
            </div>
            <div className="col-12 col-lg-6">
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-100'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-100" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-200'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-200" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-300'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-300" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-400'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-400" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-500'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-500" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-shadow-600'],
                },
              ]}>
                <div className="c-circle c-bg-dark c-shadow-600" />
              </Preview>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

export default Shadow;
