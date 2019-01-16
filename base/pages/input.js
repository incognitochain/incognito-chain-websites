import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Inputs of design system - constant.money";
const description = "Input - Design system of constant.money";

class Input extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color">
          <div className="row">
            <div className="col-12">
              <h3>Input</h3>
            </div>
            <div className="col-12">
              <h3>Basic</h3>
              <Preview type="block" code={[
                {
                  name: 'Code',
                  type: 'code',
                  code: `<input type="text" className="c-input" />`,
                }
              ]}>
                <input type="text" className="c-input" />
              </Preview>
            </div>
            <div className="col-12">
              <h3>Advance</h3>
              <Preview type="block" code={[
                {
                  name: 'Code',
                  type: 'code',
                  code: `<label>
  First name
  <input type="text" className="c-input" />
</label>`,
                }
              ]}>
                <label>
                  First name
                  <input type="text" className="c-input" />
                </label>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Code',
                  type: 'code',
                  code: `<label>
  First name
  <input type="text" className="c-input c-block" />
</label>`,
                }
              ]}>
                <label>
                  First name
                  <input type="text" className="c-input c-block" />
                </label>
              </Preview>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

export default Input;
