// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';

import './stylesheets/DescriptionItem.scss';

const DescriptionItem = ({ title, children }) => {
  return (
    <div className="description-item clearfix">
      <div className="description-item-text">{children}</div>
      <small className="description-item-sub-text">{title}</small>
    </div>
  );
}

DescriptionItem.propTypes = {
  children: PropTypes.element.isRequired
};

export default DescriptionItem;
