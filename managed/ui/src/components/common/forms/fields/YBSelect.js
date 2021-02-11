// Copyright (c) YugaByte, Inc.

import React from 'react';
import { isFunction } from 'lodash';
import { YBLabel } from '../../../../components/common/descriptors';

// TODO: Rename to YBSelect after changing prior YBSelect references.
// TODO: Make default export after checking all corresponding imports.

const YBControlledSelect = ({ selectVal, input, options, defaultValue, onInputChanged, isReadOnly }) =>{
  return (
    <select
      {...input}
      className="form-control"
      onChange={onInputChanged}
      defaultValue={defaultValue}
      value={selectVal}
      disabled={isReadOnly}
    >
      {options}
    </select>
  );
}

const YBUnControlledSelect = ({ input, options, onInputChanged, readOnlySelect }) => {
  const onChange = (event) => {
    if (input) {
      input.onChange(event.target.value);
    }
    if (isFunction(onInputChanged)) {
      onInputChanged(event.target.value);
    }
  }

  return (
    <select {...input} className="form-control" disabled={readOnlySelect} onChange={onChange}>
      {options}
    </select>
  );
}


const YBControlledSelectWithLabel = ({ label, meta, infoContent, infoTitle, ...otherProps } ) => {
  return (
    <YBLabel label={label} meta={meta} infoContent={infoContent} infoTitle={infoTitle}>
      <YBControlledSelect {...otherProps} />
    </YBLabel>
  );
}

const YBSelectWithLabel = ({ label, meta, infoContent, infoTitle, ...otherProps }) => {
  return (
    <YBLabel label={label} meta={meta} infoContent={infoContent} infoTitle={infoTitle}>
      <YBUnControlledSelect {...otherProps} />
    </YBLabel>
  );
}

export default YBSelectWithLabel;

// TODO: Rename all prior YBSelect references to YBSelectWithLabel.
export const YBSelect = YBSelectWithLabel;

export {
  YBControlledSelectWithLabel,
  YBUnControlledSelect,
  YBControlledSelect
}
