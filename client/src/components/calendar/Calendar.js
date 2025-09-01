import React from 'react';
import styled from 'styled-components';

const CalendarContainer = styled.div`
  padding: 2rem;
`;

const Calendar = () => {
  return (
    <CalendarContainer>
      <h1>Calendar</h1>
      <p>Calendar and events page</p>
    </CalendarContainer>
  );
};

export default Calendar;
