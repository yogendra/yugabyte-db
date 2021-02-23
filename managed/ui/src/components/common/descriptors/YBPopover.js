// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';

export const YBPopover = ({ className, placement, positionTop, positionLeft, style, children }) => {
  return (
    <div
      className={`popover popover-${placement} ${className}`}
      style={{
        top: positionTop,
        left: positionLeft,
        ...style
      }}
    >
      {children}
    </div>
  );
}

YBPopover.propTypes = {
  label: PropTypes.string
};
