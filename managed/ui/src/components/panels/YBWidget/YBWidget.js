// Copyright (c) YugaByte, Inc.

import React, { Component, Fragment } from 'react';

import './YBWidget.scss';
import { FlexContainer, FlexGrow } from '../../common/flexbox/YBFlexBox';

export const YBWidget = ({ className, noMargin, children, size, headerLeft, headerRight, body }) =>{
  size = size || 1;
  return (
    <div className={'widget-panel widget-panel-row-' + size + (className ? ' ' + className : '')}>
      <FlexContainer className="header">
        {headerLeft && <FlexGrow className="left">{headerLeft}</FlexGrow>}
        {headerRight && (
          <FlexGrow className="right">{headerRight}</FlexGrow>
        )}
      </FlexContainer>
      <div className={noMargin ? 'body body-no-margin' : 'body'}>
        {body && (
          <Fragment>
            {body}
            {children}
          </Fragment>
        )}
      </div>
    </div>
  );
}

YBWidget.defaultProps = {
  hideToolBox: false
};
