// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import { YBButton } from '../fields';
import { Formik } from 'formik';

const YBModalForm = ({
 visible,
 onHide,
 size,
 formName,
 onFormSubmit,
 title,
 submitLabel,
 cancelLabel,
 error,
 footerAccessory,
 showCancelButton,
 className,
 normalizeFooter,
 initialValues,
 validationSchema,
 validate,
 render,
 children
}) =>{
  let footerButtonClass = '';
  if (normalizeFooter) {
    footerButtonClass = 'modal-action-buttons';
  }

  return (
    <Modal show={visible} onHide={onHide} bsSize={size} className={className}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validate={validate}
        onSubmit={(values, actions) => {
          onFormSubmit(values, actions);
        }}
      >
        {(props) => (
          <form name={formName} onSubmit={props.handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
              <div
                className={`yb-alert-item
                  ${error ? '' : 'hide'}`}
              >
                {error}
              </div>
            </Modal.Header>
            <Modal.Body>
              {render ? render(props) : children}
            </Modal.Body>
            {(footerAccessory || showCancelButton || onFormSubmit) && (
              <Modal.Footer>
                <div className={footerButtonClass}>
                  <YBButton
                    btnClass={`btn btn-orange pull-right ${
                      props.isSubmitting ? ' btn-is-loading' : ''
                    }`}
                    loading={props.isSubmitting}
                    btnText={submitLabel}
                    btnType="submit"
                    disabled={props.isSubmitting}
                  />
                  {showCancelButton && (
                    <YBButton btnClass="btn" btnText={cancelLabel} onClick={onHide} />
                  )}
                  {footerAccessory && (
                    <div className="pull-left modal-accessory">{footerAccessory}</div>
                  )}
                </div>
              </Modal.Footer>
            )}
          </form>
        )}
      </Formik>
    </Modal>
  );
}

YBModalForm.propTypes = {
  title: PropTypes.any,
  visible: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small', 'xsmall']),
  formName: PropTypes.string,
  onFormSubmit: PropTypes.func,
  onHide: PropTypes.func,
  submitLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  footerAccessory: PropTypes.object,
  showCancelButton: PropTypes.bool,
  initialValues: PropTypes.object,
  validationSchema: PropTypes.object
};

YBModalForm.defaultProps = {
  visible: false,
  submitLabel: 'OK',
  cancelLabel: 'Cancel',
  showCancelButton: false
};

export default YBModalForm;
