import React from 'react';
import styled from 'styled-components';

const AdminContainer = styled.div`
  padding: 2rem;
`;

const AdminPanel = () => {
  return (
    <AdminContainer>
      <h1>Admin Panel</h1>
      <p>Administration and management page</p>
    </AdminContainer>
  );
};

export default AdminPanel;
