// Copyright (c) YugaByte, Inc.

import React, {Component, Fragment, useState} from 'react';
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types';
import { NodeActionModalContainer, NodeConnectModal } from '../../universes';
import { DropdownButton, MenuItem } from 'react-bootstrap';
import { YBLabelWithIcon } from '../../common/descriptors';
import { isNonEmptyArray } from '../../../utils/ObjectUtils';

import _ from 'lodash';

export const getCaption = (actionType) => {
  let caption = null;
  if (actionType === 'STOP') {
    caption = 'Stop Processes';
  } else if (actionType === 'REMOVE') {
    caption = 'Remove Node';
  } else if (actionType === 'DELETE') {
    caption = 'Delete Node';
  } else if (actionType === 'RELEASE') {
    caption = 'Release Instance';
  } else if (actionType === 'START') {
    caption = 'Start Processes';
  } else if (actionType === 'ADD') {
    caption = 'Add Node';
  } else if (actionType === 'CONNECT') {
    caption = 'Connect';
  } else if (actionType === 'START_MASTER') {
    caption = 'Start Master';
  } else if (actionType === 'QUERIES') {
    caption = 'Show Live Queries';
  }
  return caption;
}

export const getLabel = (actionType) => {
  const btnLabel = getCaption(actionType);
  let btnIcon = null;
  if (actionType === 'STOP') {
    btnIcon = 'fa fa-stop-circle';
  } else if (actionType === 'REMOVE') {
    btnIcon = 'fa fa-minus-circle';
  } else if (actionType === 'DELETE') {
    btnIcon = 'fa fa-minus-circle';
  } else if (actionType === 'RELEASE') {
    btnIcon = 'fa fa-trash';
  } else if (actionType === 'START') {
    btnIcon = 'fa fa-play-circle';
  } else if (actionType === 'ADD') {
    btnIcon = 'fa fa-plus-circle';
  } else if (actionType === 'CONNECT') {
    btnIcon = 'fa fa-link';
  } else if (actionType === 'START_MASTER') {
    btnIcon = 'fa fa-play-circle';
  } else if (actionType === 'QUERIES') {
    btnIcon = 'fa fa-search';
  }

  return <YBLabelWithIcon icon={btnIcon}>{btnLabel}</YBLabelWithIcon>;
}

export const NodeAction = (
  {
    currentRow,
    row,
    providerUUID,
    hideConnect,
    hideQueries,
    disableStop,
    disableRemove,
    disabled
  }
) => {
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [selectedRow, setSelectedRow] = useState(row);

  const openModal = (actionType) => {
    setShowModal(true);
    setActionType(actionType);
    setSelectedRow(row)
  };

  const closeModal = () => {
    setShowModal(false);
  }



  const handleLiveQueryClick = () =>{
    const path = browserHistory.getCurrentLocation().pathname;
    let universeUrl = '';
    if (path[path.length - 1] === '/') {
      universeUrl = path.substring(0, path.lastIndexOf('/', path.length - 2));
    } else {
      universeUrl = path.substring(0, path.lastIndexOf('/'));
    }
    browserHistory.push(`${universeUrl}/queries?nodeName=${currentRow.name}`);
  }

  const actionButtons = currentRow.allowedActions.map((actionType, idx) => {
    const btnId = _.uniqueId('node_action_btn_');
    const isDisabled = disabled ||
      (actionType === 'STOP' && disableStop) ||
      (actionType === 'REMOVE' && disableRemove);
    return (
      <MenuItem
        key={btnId}
        eventKey={btnId}
        disabled={isDisabled}
        onClick={() => isDisabled || openModal(actionType)}
      >
        {getLabel(actionType)}
      </MenuItem>
    );
  });

  return (
    <DropdownButton className="btn btn-default" title="Actions" id="bg-nested-dropdown" pullRight>
      {!hideConnect && (
        <NodeConnectModal
          currentRow={currentRow}
          providerUUID={providerUUID}
          label={getLabel('CONNECT')}
        />
      )}
      {isNonEmptyArray(currentRow.allowedActions) ? (
        <Fragment>
          {actionButtons}
          <NodeActionModalContainer
            visible={showModal}
            onHide={closeModal}
            nodeInfo={currentRow}
            actionType={actionType}
          />
        </Fragment>
      ) : null}
      {!hideQueries &&
        <MenuItem key="queries_action_btn" eventKey="queries_action_btn"
          disabled={disabled} onClick={handleLiveQueryClick}>
          {this.getLabel('QUERIES')}
        </MenuItem>
      }
    </DropdownButton>
  );
}

NodeAction.propTypes = {
  currentRow: PropTypes.object,
  actionType: PropTypes.oneOf(['STOP', 'REMOVE'])
};
