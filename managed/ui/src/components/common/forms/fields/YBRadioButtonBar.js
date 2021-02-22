// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import { isNonEmptyArray } from '../../../../utils/ObjectUtils';
import YBRadioButton from './YBRadioButton';
import { YBLabel } from '../../descriptors';
import _ from 'lodash';

const YBRadioButtonBar = ({ initialValue, onSelect, isReadOnly, input, options  }) => {
  const [fieldValue, setFieldValue] = useState(initialValue)

  useEffect(() => {
    setFieldValue(fieldValue)
  }, [])

  const radioButtonChecked = (event) => {
    if (!isReadOnly) {
      if (onSelect) {
        onSelect(event.target.value);
      }
      setFieldValue(event.target.value);
      input.onChange(event.target.value);
    }
  };

  function radioButtonForOption(option) {
    let value, display;
    if (isNonEmptyArray(option)) {
      [value, display] = option;
    } else if (_.isObject(option)) {
      value = option.value;
      display = option.display;
    } else {
      value = display = option;
    }
    const isChecked = _.isEqual(fieldValue.toString(), value.toString());
    function getLabelClass() {
      return 'btn' + (isChecked ? ' btn-orange' : ' btn-default');
    }

    return (
      <YBRadioButton
        key={value}
        {...input}
        isReadOnly={isReadOnly}
        fieldValue={value}
        checkState={isChecked}
        label={display}
        labelClass={getLabelClass()}
        onClick={radioButtonChecked}
      />
    );
  }
  return (
    <div className="btn-group btn-group-radio" data-toggle="buttons">
      {options.map(radioButtonForOption)}
    </div>
  );
}

const YBRadioButtonBarDefault = ({ input, options, initialValue, onSelect, isReadOnly, ...otherProps }) => {
  const [fieldValue, setFieldValue] = useState(initialValue)

  useEffect(() => {
    setFieldValue(fieldValue)
  }, [])

  const radioButtonChecked = (event) => {
    if (!isReadOnly) {
      if (onSelect) {
        onSelect(event.target.value);
      }
      setFieldValue(event.target.value);
      input.onChange(event.target.value);
    }
  };

  function radioButtonForOption(option) {
    let value, display;
    if (isNonEmptyArray(option)) {
      [value, display] = option;
    } else if (_.isObject(option)) {
      value = option.value;
      display = option.display;
    } else {
      value = display = option;
    }
    const isChecked = _.isEqual(fieldValue.toString(), value.toString());

    return (
      <YBRadioButton
        key={value}
        {...input}
        isReadOnly={isReadOnly}
        fieldValue={value}
        checkState={isChecked}
        label={display}
        onClick={radioButtonChecked}
        {...otherProps}
      />
    );
  }
  return (
    <div className="btn-group btn-group-radio" data-toggle="buttons">
      {options.map(radioButtonForOption)}
    </div>
  );
}

const YBRadioButtonBarWithLabel = ({ label, meta, ...otherProps }) => {
  return (
    <YBLabel label={label} meta={meta}>
      <YBRadioButtonBar {...otherProps} />
    </YBLabel>
  );
}

const YBRadioButtonBarDefaultWithLabel = ({ label, meta, ...otherProps }) =>{
  return (
    <YBLabel label={label} meta={meta}>
      <YBRadioButtonBarDefault {...otherProps} />
    </YBLabel>
  );
}

export default YBRadioButtonBar;

export {
  YBRadioButtonBarDefault,
  YBRadioButtonBarDefaultWithLabel,
  YBRadioButtonBarWithLabel
}
