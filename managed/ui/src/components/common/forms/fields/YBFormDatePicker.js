// Copyright (c) YugaByte, Inc.

import React from 'react';
import { YBLabel } from '../../../../components/common/descriptors';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const YBFormDatePicker = ({ pickerComponent, ...rest}) =>{
  return (
    <YBLabel {...rest}>
      <DayPickerInput component={pickerComponent} {...rest} {...rest.field} />
    </YBLabel>
  );
}

export default YBFormDatePicker;
