// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import { isFunction } from 'lodash';
import { DescriptionItem, YBLabel } from '../../../../components/common/descriptors';
import { isNonEmptyString } from '../../../../utils/ObjectUtils';

const YBTextArea =
(
  {
    input,
    type,
    className,
    placeHolder,
    onValueChanged,
    isReadOnly,
    label,
    meta,
    insetError,
    infoContent,
    infoTitle,
    infoPlacement,
    subLabel
  }
) =>{
  const onChange = (event) => {
    if (isFunction(onValueChanged)) {
      onValueChanged(event.target.value);
    }
    input.onChange(event.target.value);
  }

  const ybLabelContent = isNonEmptyString(subLabel) ? (
    <DescriptionItem title={subLabel}>
      <FormControl
        {...input}
        componentClass="textarea"
        placeholder={placeHolder}
        type={type}
        className={className}
        onChange={onChange}
        readOnly={isReadOnly}
      />
    </DescriptionItem>
  ) : (
    <FormControl
      {...input}
      componentClass="textarea"
      placeholder={placeHolder}
      type={type}
      className={className}
      onChange={onChange}
      readOnly={isReadOnly}
    />
  );

  return (
    <YBLabel
      label={label}
      insetError={insetError}
      meta={meta}
      infoContent={infoContent}
      infoTitle={infoTitle}
      infoPlacement={infoPlacement}
    >
      {ybLabelContent}
    </YBLabel>
  );
}

YBTextArea.defaultProps = {
  isReadOnly: false
};

export default YBTextArea;
