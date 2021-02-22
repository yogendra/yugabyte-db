// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import './ItemStatus.scss';

const ItemStatus = ({ showLabelText } ) => {
  let statusText = '';
  // TODO: Add other statuses here.
  const statusClassName = 'good';
  if (showLabelText) {
    // TODO: Add other statuses here.
    statusText = 'Ready';
  }

  return (
    <div className={'universe-status ' + statusClassName}>
      <i className="fa fa-check-circle" />
      {statusText && <span>{statusText}</span>}
    </div>
  );
}

export default ItemStatus;
