// Copyright (c) YugaByte, Inc.

import React, {Component, Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import { YBModal } from '../../common/forms/fields';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { connect } from 'react-redux';
import { isEmptyObject } from '../../../utils/ObjectUtils';
import { YBCopyButton } from '../../../components/common/descriptors';
import { MenuItem } from 'react-bootstrap';

import './NodeConnectModal.scss';

import _ from 'lodash';

function mapStateToProps(state, ownProps) {
  return {
    accessKeys: state.cloud.accessKeys
  };
}

export const NodeConnectModal = connect(mapStateToProps)((
  { currentRow, label, accessKeys, providerUUID }
) =>{

  const [showConnectModal, setShowConnectModal] = useState(false);

  const toggleConnectModal = (value) => {
    setShowConnectModal(value);
  };


  const nodeIPs = { privateIP: currentRow.privateIP, publicIP: currentRow.publicIP };
  if (isEmptyObject(nodeIPs) || !getPromiseState(accessKeys).isSuccess()) {
    return <MenuItem>{label}</MenuItem>;
  }

  const accessKey = accessKeys.data.filter((key) => key.idKey.providerUUID === providerUUID)[0];
  if (isEmptyObject(accessKey)) {
    return <span />;
  }
  const accessKeyInfo = accessKey.keyInfo;
  const sshPort = accessKeyInfo.sshPort || 54422;
  const privateSSHCommand = `sudo ssh -i ${accessKeyInfo.privateKey} -ostricthostkeychecking=no -p ${sshPort} yugabyte@${nodeIPs.privateIP}`;
  const btnId = _.uniqueId('node_action_btn_');
  return (
    <Fragment>
      <MenuItem eventKey={btnId} onClick={() => toggleConnectModal(true)}>
        {label}
      </MenuItem>
      <YBModal
        title={'Access your node'}
        visible={showConnectModal}
        onHide={() => toggleConnectModal(false)}
        showCancelButton={true}
        cancelLabel={'OK'}
      >
        <pre className={'node-command'}>
          <code>{privateSSHCommand}</code>
          <YBCopyButton text={privateSSHCommand} />
        </pre>
      </YBModal>
    </Fragment>
  );
})

NodeConnectModal.propTypes = {
  currentRow: PropTypes.object,
  label: PropTypes.element,
  providerUUID: PropTypes.string.isRequired
};

NodeConnectModal.defaultProps = {
  currentRow: {}
};

