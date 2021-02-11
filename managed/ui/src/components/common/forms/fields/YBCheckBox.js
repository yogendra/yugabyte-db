// Copyright (c) YugaByte, Inc.

import React  from 'react';

import { isValidObject } from '../../../../utils/ObjectUtils';

const YBCheckBox = ({ input, label, checkState, onClick, name, id }) => {
  const onCheckClick = (event) => {
    if (input && input.onChange) {
      input.onChange(event);
    }
    if (isValidObject(onClick)) {
      onClick(event);
    }
  };
  return (
    <label htmlFor={name}>
      <span className="yb-input-checkbox">
        <input
          className="yb-input-checkbox__input"
          {...input}
          type="checkbox"
          name={name}
          defaultChecked={checkState}
          id={id}
          onClick={onCheckClick}
        />
        <span className="yb-input-checkbox__inner" />
      </span>
      <span style={{marginLeft: '6px', verticalAlign: 'middle'}}>
        {label}
      </span>
    </label>
  );
}

export default YBCheckBox;
