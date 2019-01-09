import React from 'react';
import Header from '@/components/Header/Header';
import SubHeader from '@/components/Header/SubHeader';
import Footer from '@/components/Footer/Footer';

const Layout = ({ children, showSubHeader, footerType }) => (
  <>
    <Header />
    <SubHeader show={showSubHeader} />
    <main>
      {children}
    </main>
    <Footer type={footerType} />
  </>
);

export default Layout;
