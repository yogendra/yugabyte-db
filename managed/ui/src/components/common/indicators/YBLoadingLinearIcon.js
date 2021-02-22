// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './stylesheets/YBLoadingIcon.scss';

const YBLoadingLinearIcon = ({ size }) => {
  const className = `yb-loader-linear ${(size ? `yb-loader-linear-${size}` : '')}`;
  return (
    <div className={className}>
      <div />
    </div>
  );
}

YBLoadingLinearIcon.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'inline'])
};

export default YBLoadingLinearIcon;
