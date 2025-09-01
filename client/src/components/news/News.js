import React from 'react';
import styled from 'styled-components';

const NewsContainer = styled.div`
  padding: 2rem;
`;

const News = () => {
  return (
    <NewsContainer>
      <h1>News</h1>
      <p>News and announcements page</p>
    </NewsContainer>
  );
};

export default News;
