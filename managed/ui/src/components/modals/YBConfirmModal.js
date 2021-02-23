// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { YBModal } from '../common/forms/fields';

export const YBConfirmModal = ({ name, title, confirmLabel, cancelLabel, hideConfirmModal, onConfirm, currentModal, visibleModal, children }) =>{
  const submitConfirmModal = () => {
    if (onConfirm) {
      onConfirm();
    }
    hideConfirmModal();
  };

  return (
    <div className={name} key={name}>
      <YBModal
        title={title}
        visible={visibleModal === currentModal}
        onHide={hideConfirmModal}
        showCancelButton={true}
        cancelLabel={cancelLabel}
        submitLabel={confirmLabel}
        onFormSubmit={submitConfirmModal}
        submitOnCarriage
      >
        {children}
      </YBModal>
    </div>
  );
}

YBConfirmModal.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string
};

YBConfirmModal.defaultProps = {
  confirmLabel: 'Confirm',
  cancelLabel: 'Cancel'
};
