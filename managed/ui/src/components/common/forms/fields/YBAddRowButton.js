// Copyright (c) YugaByte, Inc.

import React from 'react';
import { YBButton } from './';

export const YBAddRowButton = ({ onClick, btnText, ...props }) => (
  <YBButton
    btnClass="yb-add-button"
    btnIcon="fa fa-plus"
    btnText={btnText}
    onClick={onClick}
    {...props}
  />
);
