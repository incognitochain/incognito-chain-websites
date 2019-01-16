import React from 'react';
import Header from '@/components/Header';
import '@/auth.scss';

class LoadingPage extends React.Component {
  render() {
    return (
      <>
        <Header hideAuthMenu={true} />
        <div>
          <div className="container">
            <div className="row">
              <div className="col-12"><div /></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default LoadingPage;
