// Copyright (c) YugaByte, Inc.

import React from 'react';
import { YBModal } from '../../common/forms/fields';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import {getCaption} from "./NodeAction";

export const NodeActionModal = (
  {
    universe: { currentUniverse },
    nodeInfo,
    actionType,
    performUniverseNodeAction,
    onHide,
    visible
}
) =>{

  const performNodeAction = () => {
    const universeUUID = currentUniverse.data.universeUUID;
    performUniverseNodeAction(universeUUID, nodeInfo.name, actionType);
    onHide();
    browserHistory.push('/universes/' + universeUUID + '/nodes');
  };

  if (actionType === null || nodeInfo === null) {
    return <span />;
  }

  return (
    <div className="universe-apps-modal">
      <YBModal
        title={`Perform Node Action: ${getCaption(actionType)} `}
        visible={visible}
        onHide={onHide}
        showCancelButton={true}
        cancelLabel={'Cancel'}
        onFormSubmit={performNodeAction}
      >
        Are you sure you want to {actionType.toLowerCase()} {nodeInfo.name}?
      </YBModal>
    </div>
  );
}

NodeActionModal.propTypes = {
  nodeInfo: PropTypes.object.isRequired,
  actionType: PropTypes.string
};
