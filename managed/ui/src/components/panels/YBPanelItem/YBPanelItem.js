// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';

import './YBPanelItem.scss';

export const YBPanelItem = ({ noBackground, className, children, title, header, body }) => {
  const bodyClassName = 'body ' + (noBackground ? 'body-transparent' : '');
  return (
    <div className={className ? 'content-panel ' + className : 'content-panel'}>
      {(header || title) && (
        <div className="header">
          {header} {title}
        </div>
      )}
      {body && (
        <div className={bodyClassName}>
          {body}
          {children}
        </div>
      )}
    </div>
  );
}

YBPanelItem.defaultProps = {
  hideToolBox: false
};
