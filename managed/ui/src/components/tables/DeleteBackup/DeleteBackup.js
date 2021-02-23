// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { YBModal } from '../../common/forms/fields';
import PropTypes from 'prop-types';
import { isNonEmptyObject } from '../../../utils/ObjectUtils';

export const DeleteBackup = (
  {
    tableInfo: { backupUUID },
    deleteBackup,
    onHide,
    onSubmit,
    onError,
    visible
  }
) => {

  const confirmDeleteBackup = async () => {
    try {
      const response = await deleteBackup(backupUUID);
      onSubmit(response.data);
    } catch (err) {
      if (onError) {
        onError();
      }
    }
    onHide();
  };


  if (!isNonEmptyObject(this.props.tableInfo)) {
    return <span />;
  }

  return (
    <div className="universe-apps-modal">
      <YBModal
        title={'Delete Backup'}
        visible={visible}
        onHide={onHide}
        showCancelButton={true}
        cancelLabel={'Cancel'}
        onFormSubmit={confirmDeleteBackup}
      >
        Are you sure you want to delete this backup?
      </YBModal>
    </div>
  );
}

DeleteBackup.propTypes = {
  tableInfo: PropTypes.object
};
