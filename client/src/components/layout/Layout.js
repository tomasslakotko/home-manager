import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  background: var(--color-background);
`;

const Header = styled.header`
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 2rem;
`;

const Main = styled.main`
  padding: 2rem;
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <Header>
        <h1>HomeManager</h1>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};

export default Layout;
