// Copyright (c) YugaByte, Inc.

import React from 'react';

const YBFormRadioButton = (
  {
    field: { name, value, onChange, onBlur },
    id,
    label,
    disabled,
    segmented,
    isReadOnly,
    className,
    labelClass,
    ...props
  }
) => {
  labelClass = labelClass || 'radio-label';
  if (segmented) labelClass += ' btn' + (id === value ? ' btn-orange' : ' btn-default');
  if (disabled) {
    labelClass += ' disabled';
  }
  if (isReadOnly) {
    labelClass += ' readonly';
  }
  const key = name + '_' + id;
  return (
    <label htmlFor={key} className={labelClass}>
      <input
        name={name}
        id={key}
        value={id}
        readOnly={isReadOnly}
        disabled={disabled}
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        className={className}
        {...props}
        type="radio"
      />
      {label}
    </label>
  );
}


export default  YBFormRadioButton;
