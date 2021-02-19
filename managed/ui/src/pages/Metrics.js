// Copyright (c) YugaByte, Inc.

import React, {useState} from 'react';

import { CustomerMetricsPanelContainer } from '../components/metrics';
import Measure from 'react-measure';

const Metrics = () => {
  const [dimensions, setDimensions] = useState({});
  return (
    <Measure onMeasure={setDimensions}>
      <div className="dashboard-container">
        <CustomerMetricsPanelContainer origin={'customer'} width={dimensions.width} />
      </div>
    </Measure>
  );
};

export default Metrics;
