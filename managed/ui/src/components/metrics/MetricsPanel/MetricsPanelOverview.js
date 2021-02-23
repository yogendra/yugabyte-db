// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { isNonEmptyObject, isNonEmptyArray } from '../../../utils/ObjectUtils';
import './MetricsPanel.scss';
import Measure from 'react-measure';
import _ from 'lodash';
import { METRIC_FONT } from '../MetricsConfig';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

const Plotly = require('plotly.js/lib/core');

export const MetricsPanelOverview = ({ metricKey, metric } ) =>{
  const [graphMounted, setGraphMounted] = useState(false);
  const [dimensions, setDimensions] = useState({});
  const [layout, setLayout]= useState({});

  useEffect(() => {
    const metric = _.cloneDeep(metric);
    if (isNonEmptyObject(metric)) {
      // TODO: send this data from backend.
      let max = 0;
      metric.data.forEach(function (data) {
        if (data.y) {
          data.y.forEach(function (y) {
            y = parseFloat(y) * 1.25;
            if (y > max) max = y;
          });
        }
      });
      metric.layout.xaxis.hoverformat = '%H:%M:%S, %b %d, %Y';
      if (max === 0) max = 1.01;
      metric.layout.autosize = false;
      metric.layout.width = dimensions.width || 300;
      metric.layout.height = 145;
      metric.layout.title = '';
      metric.layout.showlegend = false;
      metric.layout.margin = {
        l: 30,
        r: 0,
        b: 16,
        t: 0,
        pad: 0
      };

      if (isNonEmptyObject(metric.layout.yaxis)) {
        metric.layout.yaxis.range = [0, max];
      } else {
        metric.layout.yaxis = { range: [0, max] };
      }
      metric.layout.yaxis.ticksuffix = '&nbsp;';
      metric.layout.yaxis.fixedrange = true;
      metric.layout.xaxis.fixedrange = true;
      metric.layout.yaxis._offset = 10;
      metric.layout.font = {
        family: METRIC_FONT,
        weight: 300
      };
      metric.layout.xaxis = {
        ...metric.layout.xaxis,
        ...{ color: '#444444', zerolinecolor: '#000', gridcolor: '#eee' }
      };
      metric.layout.yaxis = {
        ...metric.layout.yaxis,
        ...{ color: '#444444', zerolinecolor: '#000', gridcolor: '#eee' }
      };

      // Handle the case when the metric data is empty, we would show
      // graph with No Data annotation.
      if (!isNonEmptyArray(metric.data)) {
        metric.layout.annotations = [
          {
            visible: true,
            align: 'top',
            text: 'No Data',
            font: {
              color: '#44518b',
              family: 'Inter',
              size: 14
            },
            showarrow: false,
            x: 1,
            y: 1
          }
        ];
        metric.layout.xaxis = {
          range: [0, 2],
          color: '#444',
          linecolor: '#eee',
          zerolinecolor: '#eee',
          gridcolor: '#eee'
        };
        metric.layout.yaxis = {
          range: [0, 2],
          color: '#444',
          linecolor: '#eee',
          zerolinecolor: '#eee',
          gridcolor: '#eee'
        };
      }

      setGraphMounted(true);
      setLayout(metric.layout)
      Plotly.newPlot(metricKey, metric.data, metric.layout, { displayModeBar: false });
    }

    return () => {Plotly.purge(metricKey)};
  }, []);

  useComponentDidUpdate(()=> {
    const metric = _.cloneDeep(metric);
    let max = 0;
    if (isNonEmptyObject(metric)) {
      // TODO: send this data from backend.
      metric.data.forEach(function (data) {
        if (data.y) {
          data.y.forEach(function (y) {
            y = parseFloat(y) * 1.25;
            if (y > max) max = y;
          });
        }
      });
    }
    if (max === 0) max = 1.01;
    if (!isNonEmptyArray(metric.data)) {
      max = 2;
    }
    Plotly.react(
      metricKey,
      metric.data,
      { ...layout, yaxis: { range: [0, max] } },
      { displayModeBar: false }
    );
  }, [])

  const onResize = (dimensions) => {
    setLayout({...layout, width: dimensions.width })
    if (graphMounted) Plotly.relayout(metricKey, { width: dimensions.width });
  }

  return (
    <Measure onMeasure={onResize}>
      <div id={metricKey} className="metrics-panel">
        <div />
      </div>
    </Measure>
  );
}

MetricsPanelOverview.propTypes = {
  metric: PropTypes.object.isRequired,
  metricKey: PropTypes.string.isRequired
};
