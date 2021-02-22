// Copyright (c) YugaByte, Inc.

import React, { Fragment, Component } from 'react';
import Dropzone from 'react-dropzone';
import { YBLabel } from '../../../../components/common/descriptors';

import './stylesheets/YBDropZone.scss';

const YBDropZone =
({
  input,
  title,
  meta: { touched, error },
  name,
  className
}) => {
  const onDrop = (file) => {
    input.onChange(file[0]);
  };
  return (
    <Fragment>
      <div
        className={`form-group file-upload form-alt ${touched && error ? 'has-error' : ''} ${
          input.value ? 'has-value' : ''
        }`}
      >
        <Dropzone className={className} name={name} onDrop={onDrop}>
          <p>{title}</p>
        </Dropzone>
        {touched && error && <span className="help-block standard-error">{error}</span>}
        {input.value && <span className="drop-zone-file">{input.value.name}</span>}
      </div>
    </Fragment>
  );
}


const YBDropZoneWithLabel  = (
  {
    input,
    title,
    meta,
    className,
    name,
    insetError,
    infoContent,
    label,
    infoTitle,
    infoPlacement
  }
) => {
  const onDrop = (file, e) => {
    this.props.input.onChange(file[0]);
  };
  const { touched, error } = meta;
  return (
    <YBLabel
      label={label}
      insetError={insetError}
      meta={meta}
      infoContent={infoContent}
      infoTitle={infoTitle}
      infoPlacement={infoPlacement}
    >
      <div
        className={`form-group yb-field-group form-alt file-upload ${
          touched && error ? 'has-error' : ''
        } ${input.value ? 'has-value' : ''}`}
      >
        <Dropzone className={className} name={name} onDrop={onDrop}>
          <p>{title}</p>
        </Dropzone>
        {touched && error && <span className="help-block standard-error">{error}</span>}
        {input.value && <span className="drop-zone-file">{input.value.name}</span>}
      </div>
    </YBLabel>
  );
}

export { YBDropZone, YBDropZoneWithLabel };
