// Copyright (c) YugaByte, Inc.

import React from 'react';
import Dropzone from 'react-dropzone';
import _ from 'lodash';

import './stylesheets/YBDropZone.scss';

const YBFormDropZone = (
  {
    title,
    field: { name },
    form,
    accept,
    className
  }
) => {
  const onDrop = (acceptedFiles, e) => {
    const { setFieldValue, setFieldTouched } = form;
    if (acceptedFiles.length === 0) {
      return;
    }
    setFieldValue(name, acceptedFiles[0]);
    setFieldTouched(name, true);
  };

  const { errors, values, touched } = form;
  const error = _.get(errors, name);
  const value = _.get(values, name);
  const hasError = error && (_.get(touched, name) || form.submitCount > 0);
  return (
    <>
      <div
        className={`form-group yb-field-group file-upload ${hasError ? 'has-error' : ''} ${
          value ? 'has-value' : ''
        }`}
      >
        <Dropzone
          className={className}
          name={name}
          accept={accept}
          onDrop={onDrop}
        >
          {title && <p>{title}</p>}
        </Dropzone>
        {hasError && <span className="help-block standard-error">{error}</span>}
        {value && <span className="drop-zone-file">{value.name}</span>}
      </div>
    </>
  );
}

export default YBFormDropZone;
