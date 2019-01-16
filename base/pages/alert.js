import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Inputs of design system - constant.money";
const description = "Input - Design system of constant.money";

class Alert extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color">
          <div className="row">
            <div className="col-12">
              <h3>Alert</h3>
            </div>
            <div className="col-12">
              <h3>Basic</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert-primary'],
                }
              ]}>
                <div className="c-alert c-alert-primary">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert-success'],
                }
              ]}>
                <div className="c-alert c-alert-success">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert-error'],
                }
              ]}>
                <div className="c-alert c-alert-error">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert-alert'],
                }
              ]}>
                <div className="c-alert c-alert-alert">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert-dark'],
                }
              ]}>
                <div className="c-alert c-alert-dark">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
            </div>
            <div className="col-12">
              <h3>With text color</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert c-alert-primary c-color-primary'],
                }
              ]}>
                <div className="c-alert c-alert-primary c-color-primary">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
            </div>
            <div className="col-12">
              <h3>With close button</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-alert c-alert-primary c-color-primary'],
                }
              ]}>
                <div className="c-alert c-alert-primary c-color-primary">
                  Curabitur lobortis id lorem id bibendum. Ut id consectetur magna.
                </div>
              </Preview>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

export default Alert;
