import React from 'react';
import styled from 'styled-components';

const BillsContainer = styled.div`
  padding: 2rem;
`;

const Bills = () => {
  return (
    <BillsContainer>
      <h1>Bills</h1>
      <p>Bills management page</p>
    </BillsContainer>
  );
};

export default Bills;
