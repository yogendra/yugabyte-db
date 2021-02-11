// Copyright (c) YugaByte, Inc.

import React from 'react';

import './stylesheets/YBPanelLegend.scss';

const YBPanelLegend = ({ data }) =>{
  return (
    <div className="panel-legend">
      {data.map((item, index) => (
        <div key={index} className="panel-legend-item">
          <span style={{ backgroundColor: item.color }} />
          {item.title}
        </div>
      ))}
    </div>
  );
}

export default YBPanelLegend;
