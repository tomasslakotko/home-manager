import React from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  padding: 2rem;
`;

const Profile = () => {
  return (
    <ProfileContainer>
      <h1>Profile</h1>
      <p>User profile and settings page</p>
    </ProfileContainer>
  );
};

export default Profile;
