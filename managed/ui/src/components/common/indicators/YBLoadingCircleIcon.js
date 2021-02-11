// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/YBLoadingIcon.scss';

const YBLoadingCircleIcon = ({ size }) => {
  const className = `yb-loader-circle ${(size ? `yb-loader-circle-${size}` : '')}`;
  return (
    <div className={className}>
      <div className="yb-loader-circle1 yb-child" />
      <div className="yb-loader-circle2 yb-child" />
      <div className="yb-loader-circle3 yb-child" />
      <div className="yb-loader-circle4 yb-child" />
      <div className="yb-loader-circle5 yb-child" />
      <div className="yb-loader-circle6 yb-child" />
      <div className="yb-loader-circle7 yb-child" />
      <div className="yb-loader-circle8 yb-child" />
      <div className="yb-loader-circle9 yb-child" />
      <div className="yb-loader-circle10 yb-child" />
      <div className="yb-loader-circle11 yb-child" />
      <div className="yb-loader-circle12 yb-child" />
    </div>
  );
}

YBLoadingCircleIcon.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'inline'])
};

export default YBLoadingCircleIcon;
