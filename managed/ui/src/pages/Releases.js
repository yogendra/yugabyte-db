// Copyright (c) YugaByte, Inc.

import React from 'react';

import { ReleaseListContainer } from '../components/releases';

export const Releases = () => {
  return (
    <div className="dashboard-container">
      <ReleaseListContainer />
    </div>
  );
};

export default Releases;
