// Copyright (c) YugaByte, Inc.

import React from 'react';

import { CustomerProfileContainer } from '../components/profile';

export const Profile = (props) => {
  return (
    <div className="dashboard-container">
      <CustomerProfileContainer {...props} />
    </div>
  );
};

export default Profile;
