// Copyright (c) YugaByte, Inc.

import React from 'react';

import { YugawareLogsContainer } from '../components/yugaware_logs';

export const YugawareLogs = () => {
  return (
    <div className="dashboard-container">
      <YugawareLogsContainer />
    </div>
  );
};

export default YugawareLogs;
