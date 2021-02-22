// Copyright (c) YugaByte, Inc.

import React from 'react';
import NumericInput from 'react-numeric-input';
import { isFunction } from 'lodash';
import { YBLabel } from '../../../../components/common/descriptors';

// TODO: Rename to YBNumericInput after changing prior YBNumericInput references.
// TODO: Make default export after checking all corresponding imports.

const YBControlledNumericInput =
({
   input,
   val,
   className,
   onInputChanged,
   onInputSelect,
   onInputBlur,
   disabled,
   onInputFocus,
   valueFormat,
   minVal,
   readOnly
 }) => {
  return (
    <NumericInput
      {...input}
      className={`form-control ${className}`}
      value={val}
      onChange={onInputChanged}
      onSelect={onInputSelect}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      format={valueFormat}
      min={minVal}
      readOnly={readOnly}
      disabled={disabled}
    />
  );
}

YBControlledNumericInput.defaultProps = {
  minVal: 0
};

const YBUnControlledNumericInput = ({ input, onInputChanged, minVal, readOnly }) => {
  const onChange = (value) => {
    input.onChange(value);
    if (isFunction(onInputChanged)) {
      onInputChanged(value);
    }
  }

  return (
    <NumericInput
      {...input}
      className="form-control"
      min={minVal}
      onChange={onChange}
      readOnly={readOnly}
    />
  );
}


YBUnControlledNumericInput.defaultProps = {
  minVal: 0
}

const YBNumericInputWithLabel = ({ label, meta, infoContent, infoTitle, ...otherProps }) => {
  return (
    <YBLabel label={label} meta={meta} infoContent={infoContent} infoTitle={infoTitle}>
      <YBUnControlledNumericInput {...otherProps} />
    </YBLabel>
  );
}

const YBControlledNumericInputWithLabel = ({ label, meta, onLabelClick, ...otherProps }) => {
  return (
    <YBLabel label={label} meta={meta} onLabelClick={onLabelClick}>
      <YBControlledNumericInput {...otherProps} />
    </YBLabel>
  );
}

// TODO: Rename all prior YBNumericInput references to YBNumericInputWithLabel.
export const YBNumericInput = YBNumericInputWithLabel;

export { YBControlledNumericInput, YBUnControlledNumericInput, YBNumericInputWithLabel, YBControlledNumericInputWithLabel };
