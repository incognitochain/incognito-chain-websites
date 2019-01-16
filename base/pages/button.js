import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegramPlane } from '@fortawesome/free-brands-svg-icons';
import { faPlus } from '@fortawesome/pro-light-svg-icons';

import Head from '../components/Head';
import Layout from '../components/Layout';
import Preview from '../components/Preview';

import '../styles/demo.scss';

const title = "Buttons of design system - constant.money";
const description = "Button - Design system of constant.money";

class Button extends React.Component {
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
      <>
        <Head title={title} description={description} />
        <Layout>
          <div className="row">
            <div className="col-12">
              <h2>Button</h2>
            </div>
            <div className="col-12">
              <h3>Button basic</h3>
              <Preview type="block" code={[
                {
                  name: 'Code',
                  type: 'code',
                  code: `<button className="c-btn c-btn-primary">
  <span>Place order</span>
</button>`,
                },
                {
                  name: 'React',
                  type: 'code',
                  code: `<Button>
  Place order
</Button>`,
                }
              ]}>
                <button className="c-btn c-btn-primary">
                  <span>Place order</span>
                </button>
              </Preview>
            </div>
            <div className="col-12">
              <h3>Button size</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-primary c-btn-lg'],
                },
                {
                  name: 'React',
                  type: 'code',
                  code: `<Button size="lg">
  Place order
</Button>`,
                }
              ]}>
                <button className="c-btn c-btn-primary c-btn-lg">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-primary'],
                },
                {
                  name: 'React',
                  type: 'code',
                  code: `<Button>
  Place order
</Button>`,
                }
              ]}>
                <button className="c-btn c-btn-primary">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-primary c-btn-sm'],
                },
                {
                  name: 'React',
                  type: 'code',
                  code: `<Button size="sm">
  Place order
</Button>`,
                }
              ]}>
                <button className="c-btn c-btn-primary c-btn-sm">
                  <span> Place order</span>
                </button>
              </Preview>
            </div>
            <div className="col-12">
              <h3>Button colors</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-primary'],
                }
              ]}>
                <button className="c-btn c-btn-primary">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-success'],
                }
              ]}>
                <button className="c-btn c-btn-success">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-error'],
                }
              ]}>
                <button className="c-btn c-btn-error">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-alert'],
                }
              ]}>
                <button className="c-btn c-btn-alert">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-dark'],
                }
              ]}>
                <button className="c-btn c-btn-dark">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-disabled'],
                }
              ]}>
                <button className="c-btn c-btn-disabled">
                  <span>Place order</span>
                </button>
              </Preview>
            </div>
            <div className="col-12">
              <h3>Button secondary colors</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-primary'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-primary">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-success'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-success">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-error'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-error">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-alert'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-alert">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-dark'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-dark">
                  <span>Place order</span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-secondary c-btn-disabled'],
                }
              ]}>
                <button className="c-btn c-btn-secondary c-btn-disabled">
                  <span>Place order</span>
                </button>
              </Preview>
            </div>
            <div className="col-12">
              <h3>Circle buttons</h3>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-circle c-btn-success'],
                }
              ]}>
                <button className="c-btn c-circle c-btn-success">
                  <span><FontAwesomeIcon icon={faTelegramPlane} size="lg" /></span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-circle c-btn-error'],
                }
              ]}>
                <button className="c-btn c-circle c-btn-error">
                  <span><FontAwesomeIcon icon={faPlus} size="2x" /></span>
                </button>
              </Preview>
              <Preview type="block" code={[
                {
                  name: 'Class',
                  type: 'text',
                  code: ['c-btn c-btn-error'],
                }
              ]}>
                <button className="c-btn c-square c-btn-error">
                  <span><FontAwesomeIcon icon={faPlus} size="2x" /></span>
                </button>
              </Preview>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

export default Button;
