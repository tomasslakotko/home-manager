import React from 'react';
import styled from 'styled-components';

const ParkingContainer = styled.div`
  padding: 2rem;
`;

const Parking = () => {
  return (
    <ParkingContainer>
      <h1>Parking</h1>
      <p>Parking management page</p>
    </ParkingContainer>
  );
};

export default Parking;
