// Copyright (c) YugaByte, Inc.

import React, {  } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import YBFormattedNumber from './YBFormattedNumber';

import './stylesheets/YBCost.css';

const YBCost = ({ value, multiplier }) => {
  let finalCost = value || 0;
  if (multiplier === 'day') {
    finalCost *= 24;
  } else if (multiplier === 'month') {
    finalCost = finalCost * 24 * moment().daysInMonth();
  }
  return (
    <YBFormattedNumber
      value={finalCost}
      maximumFractionDigits={2}
      formattedNumberStyle="currency"
      currency="USD"
      multiplier={multiplier}
    />
  );
}

YBCost.propTypes = {
  multiplier: PropTypes.oneOf(['day', 'month', 'hour']).isRequired
};


export default YBCost;
