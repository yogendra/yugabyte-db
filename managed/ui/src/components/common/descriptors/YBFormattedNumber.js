// Copyright (c) YugaByte, Inc.

import React  from 'react';
import { FormattedNumber } from 'react-intl';
import { isFinite } from 'lodash';

const YBFormattedNumber = ({ formattedNumberStyle, value, ...rest }) =>{
  if (!isFinite(value)) {
    return <span>n/a</span>;
  }
  return <FormattedNumber { ...{formattedNumberStyle, value, ...rest} } style={formattedNumberStyle} />;
}

export default YBFormattedNumber;
