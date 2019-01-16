import React from 'react';
import { checkAuth, logout } from '@/services/auth';
import Header from '@/components/Header';
import LoadingPage from '@/components/LoadingPage';
import '@/auth.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inited: false,
      isLogged: false,
      user: {},
    }
  }
  componentDidMount() {
    checkAuth((isLogged, user, error) => {
      if (isLogged) {
        this.setState({ isLogged, inited: true, user });
      }
    });
  }

  render() {
    const { isLogged, inited, user } = this.state;

    if (!inited) {
      return <LoadingPage />;
    }

    return (
      <>
        <Header user={user} />
        <div className="setting-page page">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="c-card">
                  a
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Index;
