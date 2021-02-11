// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';

const YBCodeBlock = ({ label, className, children }) => {
  return (
    <div className={className ? 'yb-code-block ' + className : 'yb-code-block'}>
      {label && <label>{label}</label>}
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

YBCodeBlock.propTypes = {
  label: PropTypes.string
};

export default YBCodeBlock;
