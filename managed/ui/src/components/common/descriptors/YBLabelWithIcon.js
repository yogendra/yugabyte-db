// Copyright (c) YugaByte, Inc.

import React  from 'react';
import PropTypes from 'prop-types';

export const YBLabelWithIcon = ({ icon, children }) => {
  return (
    <span>
      {icon && <i className={icon} />}
      {children}
    </span>
  );
}

YBLabelWithIcon.propTypes = {
  icon: PropTypes.string
};
