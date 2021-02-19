// Copyright (c) YugaByte, Inc.

import React from 'react';
import DataCenterConfigurationContainer from '../components/config/ConfigProvider/DataCenterConfigurationContainer';

const DataCenterConfiguration = (props) => {
  return (
    <div className="dashboard-container">
      <DataCenterConfigurationContainer {...props} />
    </div>
  );
};
export default DataCenterConfiguration;
