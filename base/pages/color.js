import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/pro-regular-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Colors of design system - constant.money";
const description = "Color - Design system of constant.money";

class Color extends React.Component {
  render() {
    return (
      <>
        <Head title={title} description={description} />
        <Layout title="Color">
          <div className="row">
            <div className="col-12">
              <h2>Color</h2>
            </div>
            <div className="col-12">
              <h3>Basic</h3>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Text',
                  type: 'text',
                  code: ['c-color-primary', 'c-color-info', 'c-color-blue'],
                },
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-primary', 'c-bg-info', 'c-bg-blue'],
                },
                {
                  name: 'SCSS',
                  type: 'code',
                  code: ['color: get-color(\'c-blue\');', 'background: get-color(\'c-blue\');', '@extend .c-color-blue;', '@extend .c-bg-blue;'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-primary c-shadow-300" />
              </Preview>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Text',
                  type: 'text',
                  code: ['c-color-success', 'c-color-green'],
                },
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-success', 'c-bg-green'],
                },
                {
                  name: 'SCSS',
                  type: 'code',
                  code: ['color: get-color(\'c-green\');', 'background: get-color(\'c-green\');'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-success c-shadow-300" />
              </Preview>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Text',
                  type: 'text',
                  code: ['c-color-error', 'c-color-red'],
                },
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-error', 'c-bg-red'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-error c-shadow-300" />
              </Preview>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Text',
                  type: 'text',
                  code: ['c-color-alert', 'c-color-orange'],
                },
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-alert', 'c-bg-orange'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-alert c-shadow-300" />
              </Preview>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Text',
                  type: 'text',
                  code: ['c-color-dark', 'c-color-black', 'c-color-text'],
                },
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-dark', 'c-bg-black', 'c-bg-text'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-dark c-shadow-300" />
              </Preview>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h3>Gradient backgrounds</h3>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-r-primary', 'c-bg-r-info', 'c-bg-r-blue'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-r-primary c-shadow-300" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-r-success', 'c-bg-r-green'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-r-success c-shadow-300" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-r-error', 'c-bg-r-red'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-r-error c-shadow-300" />
              </Preview>
            </div>
            <div className="col-12 col-xl-6">
              <Preview type="block" code={[
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-r-alert', 'c-bg-r-orange'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-r-alert c-shadow-300" />
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Background',
                  type: 'text',
                  code: ['c-bg-r-dark', 'c-bg-r-text', 'c-bg-r-black'],
                }
              ]}>
                <div className="c-circle c-circle-lg c-bg-r-dark c-shadow-300" />
              </Preview>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-xl-6">
              <h3>Shades of blue</h3>
              {Array.apply(0, { length: 10 }).map(Function.call, i => i * 100 + 100).map(shade => (
                <Preview key={`blue-${shade}`} type="block" code={[
                  {
                    name: 'Text',
                    type: 'text',
                    code: [`c-color-primary-${shade}`, `c-color-blue-${shade}`],
                  },
                  {
                    name: 'Background',
                    type: 'text',
                    code: [`c-bg-primary-${shade}`, `c-bg-blue-${shade}`],
                  }
                ]}>
                  <div className={`c-circle c-circle-lg c-bg-primary-${shade} c-shadow-300`} />
                </Preview>
              ))}
            </div>
            <div className="col-12 col-xl-6">
              <h3>Shades of green</h3>
              {Array.apply(0, { length: 10 }).map(Function.call, i => i * 100 + 100).map(shade => (
                <Preview key={`green-${shade}`} type="block" code={[
                  {
                    name: 'Text',
                    type: 'text',
                    code: [`c-color-success-${shade}`, `c-color-green-${shade}`],
                  },
                  {
                    name: 'Background',
                    type: 'text',
                    code: [`c-bg-success-${shade}`, `c-bg-green-${shade}`],
                  }
                ]}>
                  <div className={`c-circle c-circle-lg c-bg-success-${shade} c-shadow-300`} />
                </Preview>
              ))}
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-xl-6">
              <h3>Shades of red</h3>
              {Array.apply(0, { length: 10 }).map(Function.call, i => i * 100 + 100).map(shade => (
                <Preview key={`red-${shade}`} type="block" code={[
                  {
                    name: 'Text',
                    type: 'text',
                    code: [`c-color-error-${shade}`, `c-color-red-${shade}`],
                  },
                  {
                    name: 'Background',
                    type: 'text',
                    code: [`c-bg-error-${shade}`, `c-bg-red-${shade}`],
                  }
                ]}>
                  <div className={`c-circle c-circle-lg c-bg-error-${shade} c-shadow-300`} />
                </Preview>
              ))}
            </div>
            <div className="col-12 col-xl-6">
              <h3>Shades of orange</h3>
              {Array.apply(0, { length: 10 }).map(Function.call, i => i * 100 + 100).map(shade => (
                <Preview key={`orange-${shade}`} type="block" code={[
                  {
                    name: 'Text',
                    type: 'text',
                    code: [`c-color-alert-${shade}`, `c-color-orange-${shade}`],
                  },
                  {
                    name: 'Background',
                    type: 'text',
                    code: [`c-bg-alert-${shade}`, `c-bg-orange-${shade}`],
                  }
                ]}>
                  <div className={`c-circle c-circle-lg c-bg-alert-${shade} c-shadow-300`} />
                </Preview>
              ))}
            </div>
            <div className="col-12 col-xl-6">
              <h3>Shades of gray</h3>
              {Array.apply(0, { length: 6 }).map(Function.call, i => i * 100 + 100).map(shade => (
                <Preview key={`gray-${shade}`} type="block" code={[
                  {
                    name: 'Text',
                    type: 'text',
                    code: [`c-color-gray-${shade}`],
                  },
                  {
                    name: 'Background',
                    type: 'text',
                    code: [`c-bg-gray-${shade}`],
                  }
                ]}>
                  <div className={`c-circle c-circle-lg c-bg-gray-${shade} c-shadow-300`} />
                </Preview>
              ))}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

export default Color;
