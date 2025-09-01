import React from 'react';
import styled from 'styled-components';

const FeedbackContainer = styled.div`
  padding: 2rem;
`;

const Feedback = () => {
  return (
    <FeedbackContainer>
      <h1>Feedback</h1>
      <p>Feedback and suggestions page</p>
    </FeedbackContainer>
  );
};

export default Feedback;
