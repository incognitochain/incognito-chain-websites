import React from 'react';
import { checkAuth, logout } from '@/services/auth';
import Header from '@/components/Header';
import LoadingPage from '@/components/LoadingPage';
import '@/auth.scss';

class Profile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inited: false,
      isLogged: false,
    }
  }
  componentDidMount() {
    checkAuth((isLogged, user, error) => {
      if (isLogged) {
        this.setState({ isLogged, inited: true });
      }
    });
  }

  render() {
    const { isLogged, inited } = this.state;

    if (!inited) {
      return <LoadingPage />;
    }

    return (
      <>
        <Header />
        <div className="setting-page">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <span onClick={() => { logout() }}>Logout</span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Profile;
