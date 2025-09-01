import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <h1>Dashboard</h1>
      <p>Welcome to HomeManager Dashboard</p>
    </DashboardContainer>
  );
};

export default Dashboard;
