// Copyright (c) YugaByte, Inc.

import React, {Component, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {
  BulkImportContainer,
  CreateBackupContainer,
  RestoreBackupContainer,
  DeleteBackupContainer
} from '../../../components/tables';
import { ImportReleaseContainer, UpdateReleaseContainer } from '../../../components/releases';
import { ReleaseStateEnum } from '../../releases/UpdateRelease/UpdateRelease';
import { MenuItem } from 'react-bootstrap';
import { YBLabelWithIcon } from '../../common/descriptors';
import { YBButton } from '../../common/forms/fields';
import _ from 'lodash';

export const TableAction = (
  {
    currentRow,
    actionType, isMenuItem, disabled, onSubmit, onError,
    onModalSubmit,
    btnClass,
    className
  }
) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(currentRow);

  const openModal = () => {
    setSelectedRow(currentRow);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }


  let modalContainer = null;
  let btnLabel = null;
  let btnIcon = null;
  if (actionType === 'import') {
    btnLabel = 'Bulk Import';
    btnIcon = 'fa fa-download';
    modalContainer = (
      <BulkImportContainer
        visible={showModal}
        onHide={closeModal}
        tableInfo={selectedRow}
      />
    );
  } else if (actionType === 'create-scheduled-backup') {
    btnLabel = 'Create Scheduled Backup';
    btnIcon = 'fa fa-calendar-o';
    modalContainer = (
      <CreateBackupContainer
        visible={showModal}
        onHide={closeModal}
        tableInfo={selectedRow}
        onSubmit={onSubmit}
        onError={onError}
        isScheduled
      />
    );
  } else if (actionType === 'create-backup') {
    btnLabel = 'Create Backup';
    btnIcon = 'fa fa-upload';
    modalContainer = (
      <CreateBackupContainer
        visible={showModal}
        onHide={closeModal}
        tableInfo={selectedRow}
        onSubmit={onSubmit}
        onError={onError}
      />
    );
  } else if (actionType === 'restore-backup') {
    btnLabel = 'Restore Backup';
    btnIcon = 'fa fa-download';
    modalContainer = (
      <RestoreBackupContainer
        visible={showModal}
        onHide={closeModal}
        backupInfo={selectedRow}
        onSubmit={onSubmit}
        onError={onError}
      />
    );
  } else if (actionType === 'import-release') {
    btnLabel = 'Import';
    btnIcon = 'fa fa-upload';
    modalContainer = (
      <ImportReleaseContainer
        visible={showModal}
        onHide={closeModal}
        onModalSubmit={onSubmit}
      />
    );
  } else if (actionType === 'delete-backup') {
    btnLabel = 'Delete Backup';
    btnIcon = 'fa fa-trash';
    modalContainer = (
      <DeleteBackupContainer
        visible={showModal}
        onHide={closeModal}
        tableInfo={selectedRow}
        onSubmit={onSubmit}
        onError={onError}
      />
    );
  } else if (['disable-release', 'delete-release', 'active-release'].includes(actionType)) {
    let action;
    switch (actionType) {
      case 'disable-release':
        btnLabel = 'Disable';
        btnIcon = 'fa fa-ban';
        action = ReleaseStateEnum.DISABLED;
        break;
      case 'delete-release':
        btnLabel = 'Delete';
        btnIcon = 'fa fa-trash';
        action = ReleaseStateEnum.DELETED;
        break;
      case 'active-release':
        btnLabel = 'Active';
        btnIcon = 'fa fa-check';
        action = ReleaseStateEnum.ACTIVE;
        break;
      default:
        break;
    }
    modalContainer = (
      <UpdateReleaseContainer
        visible={showModal}
        onHide={closeModal}
        releaseInfo={selectedRow}
        actionType={action}
        onModalSubmit={onModalSubmit}
      />
    );
  }

  const btnId = _.uniqueId('table_action_btn_');
  if (isMenuItem) {
    return (
      <Fragment>
        <MenuItem eventKey={btnId} onClick={disabled ? null : openModal} disabled={disabled}>
          <YBLabelWithIcon icon={btnIcon}>{btnLabel}</YBLabelWithIcon>
        </MenuItem>
        {modalContainer}
      </Fragment>
    );
  }
  return (
    <div className={className}>
      <YBButton
        btnText={btnLabel}
        btnIcon={btnIcon}
        disabled={disabled}
        btnClass={'btn ' + btnClass}
        onClick={disabled ? null : openModal}
      />
      {modalContainer}
    </div>
  );
}

TableAction.propTypes = {
  currentRow: PropTypes.object,
  isMenuItem: PropTypes.bool,
  btnClass: PropTypes.string,
  onModalSubmit: PropTypes.func,
  onSubmit: PropTypes.func,
  onError: PropTypes.func,
  actionType: PropTypes.oneOf([
    'drop',
    'import',
    'create-backup',
    'create-scheduled-backup',
    'restore-backup',
    'import-release',
    'active-release',
    'disable-release',
    'delete-release',
    'delete-backup'
  ])
};

TableAction.defaultProps = {
  isMenuItem: true,
  btnClass: 'btn-default'
};
