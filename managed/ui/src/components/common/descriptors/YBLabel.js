// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isNonEmptyObject, isNonEmptyString } from '../../../utils/ObjectUtils';
import YBInfoTip from './YBInfoTip';
import _ from 'lodash';

const YBLabel = ({
  label,
  insetError,
  meta,
  form,
  field,
  onLabelClick,
  infoContent,
  infoTitle,
  infoPlacement,
  classOverrides,
  type,
  children
}) => {
  let infoTip = <span />;
  if (isNonEmptyString(infoContent)) {
    infoTip = (
      <span>
        &nbsp;
        <YBInfoTip content={infoContent} title={infoTitle} placement={infoPlacement} />
      </span>
    );
  }

  let errorMsg;
  let hasError = false;
  let touched;
  if (isNonEmptyObject(meta)) {
    touched = meta.touched;
    errorMsg = meta.error;
    hasError = errorMsg && touched;
  } else if (isNonEmptyObject(form)) {
    // In case for Formik field, touched might be undefined but when
    // form validation happens it can have errors.
    // Using lodash to get in case of nested arrays and objects
    errorMsg = _.get(form.errors, field.name);
    touched = _.get(form.touched, field.name) || form.submitCount > 0;
    hasError = touched && isNonEmptyString(errorMsg);
  }
  let containerClassList = `form-group ${hasError ? 'has-error' : ''} ${
    type === 'hidden' ? 'form-group-hidden' : ''
  }`;
  if (classOverrides) {
    containerClassList = `${containerClassList.trim()} ${classOverrides}`;
  }
  return (
    <div className={containerClassList} data-yb-label={label} onClick={onLabelClick}>
      {label && <label className="form-item-label">{label}</label>}
      {infoTip}
      <div className="yb-field-group">
        {children}
        {hasError && (
          <div className={`help-block ${insetError ? 'embed-error' : 'standard-error'}`}>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}

YBLabel.propTypes = {
  insetError: PropTypes.bool // true => inset error message inside text/textarea fields
};

export default YBLabel;
