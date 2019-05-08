import React, {Component} from 'react';
import Header from 'components/Header/Header';
import SubHeader from 'components/Header/SubHeader';
import Footer from 'components/Footer/Footer';
import LoadingOverlay from 'react-loading-overlay';

let component = null;

class Layout extends Component {
  constructor() {
    super();
    this.state = {
      activeOverlayLoading: false,
    }
  }

  componentDidMount() {
    component = this;
  }

  showOverlayLoading = () => {
    this.setState({activeOverlayLoading: true});
  }

  hideOverlayLoading = () => {
    this.setState({activeOverlayLoading: false});
  }

  render() {
    const {children, showSubHeader = true, footerType} = this.props;
    const {activeOverlayLoading} = this.state
    return (
      <>
        <LoadingOverlay
          active={activeOverlayLoading}
          spinner
        >
          <Header/>
          <SubHeader show={showSubHeader}/>
          <main className={`${!showSubHeader ? 'no-sub-menu' : ''}`}>
            {children}
          </main>
          <Footer type={footerType}/>
        </LoadingOverlay>
      </>
    )

  }
};

export default Layout;

export const showOverlayLoading = () => {
  if (component) {
    component.showOverlayLoading();
  }
}

export const hideOverlayLoading = () => {
  if (component) {
    component.hideOverlayLoading()
  }
}

