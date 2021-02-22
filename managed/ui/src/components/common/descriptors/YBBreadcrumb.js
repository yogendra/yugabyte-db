// Copyright (c) YugaByte, Inc.

import React from 'react';
import { Link } from 'react-router';

const YBBreadcrumb = ({ children, ...rest }) => {
  return (
    <span>
      <Link {...rest}>{children}</Link>
      <i className="fa fa-angle-right fa-fw" />
    </span>
  );
}

export default YBBreadcrumb;
