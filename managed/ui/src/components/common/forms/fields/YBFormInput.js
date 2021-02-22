// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { YBLabel } from '../../../../components/common/descriptors';
import { FormControl } from 'react-bootstrap';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

const YBFormInput = ({ field, onChange, ...rest }) => {
  const handleChange = (event) => {
    field.onChange(event);
    if (isDefinedNotNull(onChange)) onChange(this.props, event);
  };

  const { infoContent } = rest;
  return (
    <YBLabel {...rest} infoContent={infoContent}>
      <FormControl {...field} {...rest} onChange={handleChange} />
    </YBLabel>
  );
}


export default YBFormInput
