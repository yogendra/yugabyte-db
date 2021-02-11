// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { isValidObject } from '../../../../utils/ObjectUtils';

const YBRadioButton = ({ id, input, name, labelClass, checkState, fieldValue, label, disabled, isReadOnly, onClick } ) => {
  labelClass = this.props.labelClass || 'radio-label';
  if (disabled) {
    labelClass += ' disabled';
  }
  if (isReadOnly) {
    labelClass += ' readonly';
  }

  name = name || input.name;
  id = id || `radio_button_${name}_${fieldValue}`;

  const onCheckClick = function (event) {
    input && input.onChange && input.onChange(event);
    return isValidObject(onClick) ? onClick(event) : true;
  };
  return (
    <label htmlFor={id} className={labelClass}>
      <input
        {...input}
        type="radio"
        id={id}
        name={name}
        value={fieldValue}
        defaultChecked={checkState}
        disabled={disabled}
        readOnly={isReadOnly}
        onClick={onCheckClick}
      />
      {label}
    </label>
  );
}

export default YBRadioButton;
