// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';

import './Graph.scss';
import { isDefinedNotNull } from '../../../utils/ObjectUtils';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

const ProgressBar = require('progressbar.js');
const GraphPath = ProgressBar.Path;
const GraphLine = ProgressBar.Line;

const colorObj = {
  green: {
    r: 51,
    g: 158,
    b: 52
  },
  yellow: {
    r: 240,
    g: 204,
    b: 98
  },
  red: {
    r: 233,
    g: 80,
    b: 63
  }
};

// Graph componenent's value must be a float number between {0,1} interval.
// Enforce all calculations outside this component.
export const Graph = ({ value, unit, type, metricKey }) => {

  const [graph, setGraph] = useState()
  const [prevValue, setPrevValue] = useState(value)
  const values = {
    width: 0,
    color: '#339e34'
  };
  const bar = null;
  const label = useRef();
  const counter = { var: 0 };
  const initTween = null;

  const calcColor = (value) => {
    let color = '#339e34';
    let colorPercentage = 0;
    if (value > 0.3 && value < 0.6) {
      colorPercentage = (10 * value) / 3 - 1;
      color =
        'rgb(' +
        (colorObj.green.r * (1 - colorPercentage) + colorObj.yellow.r * colorPercentage) +
        ', ' +
        (colorObj.green.g * (1 - colorPercentage) + colorObj.yellow.g * colorPercentage) +
        ', ' +
        (colorObj.green.b * (1 - colorPercentage) + colorObj.yellow.b * colorPercentage) +
        ')';
    }
    if (value >= 0.6 && value < 0.8) {
      colorPercentage = 5 * value - 3;
      color =
        'rgb(' +
        (colorObj.yellow.r * (1 - colorPercentage) + colorObj.red.r * colorPercentage) +
        ', ' +
        (colorObj.yellow.g * (1 - colorPercentage) + colorObj.red.g * colorPercentage) +
        ', ' +
        (colorObj.yellow.b * (1 - colorPercentage) + colorObj.red.b * colorPercentage) +
        ')';
    }
    if (value >= 0.8) {
      color = '#E9503F';
    }
    return color;
  };


  if (isDefinedNotNull(initTween)) {
    initTween.kill();
  }

  useEffect(() => {
    const { type, value } = this.props;
    const color = this.calcColor(value);
    const _graph = ((type) => {
      if (type === 'semicircle') {
        return new GraphPath(this.bar, {
          easing: 'easeOut',
          duration: 900
        });
      }

      return new GraphLine(this.bar, {
        easing: 'easeOut',
        color: color,
        duration: 900,
        svgStyle: { width: '100%', height: '30px' }
      });
    })(type);
    _graph.set(0);
    setTimeout(
      () =>
        _graph.animate(value, {
          duration: 2000,
          from: { color: '#289b42', width: 10 },
          to: { color: color, width: 10 },
          step: (state, shape) => {
            shape.path.setAttribute('stroke', state.color);
            shape.path.setAttribute('stroke-width', state.width);
          }
        }),
      500
    );
    setGraph(_graph);
  }, [])

  useComponentDidUpdate(() => {
    if (prevValue !== value) {
      const color = calcColor(value);
      graph.animate(value, {
        duration: 1000,
        from: { color: '#289b42', width: 10 },
        to: { color: color, width: 10 },
        step: (state, shape) => {
          shape.path.setAttribute('stroke', state.color);
          shape.path.setAttribute('stroke-width', state.width);
        }
      });
    }
  }, [value])


  const getGraphByType = (type) => {
    if (type === 'semicircle') {
      return (
        <svg x="0px" y="0px" className={`graph-body`} viewBox="0 0 79.2 46.1">
          <path className="graph-base" d="M7.8,38.8C7.8,21.2,22.1,7,39.6,7s31.8,14.2,31.8,31.8" />
          <path
            className="graph-bar"
            fill="none"
            stroke="blue"
            strokeWidth="10"
            id={'graph-' + type}
            d="M7.8,38.8C7.8,21.2,22.1,7,39.6,7s31.8,14.2,31.8,31.8"
            ref={(elem) => (this.bar = elem)}
          />
        </svg>
      );
    }

    if (type === 'linear') {
      return <div id={'graph-' + type} ref={(elem) => (this.bar = elem)} />;
    }

    return null;
  };

  const _value = unit === 'percent' || unit === '%'
      ? Math.round(value * 1000) / 10
      : value;
  const _unit = unit
    ? unit === 'percent' || unit === '%'
      ? '%'
      : ' ' + unit
    : null;
  return (
    <div
      id={metricKey}
      className={`graph-container graph-${type || 'linear'}`}
    >
      {getGraphByType(type)}

      {unit && (
        <label ref={label}>
          {_value}
          {_unit}
        </label>
      )}
    </div>
  );
}

Graph.propTypes = {
  value: PropTypes.number.isRequired,
  unit: PropTypes.string,
  type: PropTypes.oneOf(['linear', 'semicircle'])
};

Graph.defaultProps = {
  type: 'linear'
};
