// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import YBLoadingCircleIcon from './YBLoadingCircleIcon';

const YBLoading = ({ size }) => {
  return (
    <div className="text-center loading-icon-container">
      <YBLoadingCircleIcon size={size} />
      <div>Loading</div>
    </div>
  );
}

YBLoading.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'inline'])
};

export default YBLoading;
