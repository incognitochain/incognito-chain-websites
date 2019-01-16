import React from 'react';
import { checkAuth, logout } from '@/services/auth';
import LoadingPage from '@/components/LoadingPage';

class Voting extends React.Component {
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
      <div className="setting-page">
        <span onClick={() => { logout() }}>Logout</span>
      </div>
    );
  }
}

export default Voting;
