// Copyright (c) YugaByte, Inc.

import React, {Component, Fragment, useEffect, useState} from 'react';
import axios from 'axios';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import { YBModal, YBButton } from '../../common/forms/fields';
import { getUniverseEndpoint } from '../../../actions/common';
import { connect } from 'react-redux';
import { openDialog, closeDialog } from '../../../actions/modal';
import { FlexContainer, FlexShrink } from '../../common/flexbox/YBFlexBox';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { isNonEmptyObject } from '../../../utils/ObjectUtils';
import { YBLoading } from '../../common/indicators';
import { YBCodeBlock, YBCopyButton } from '../../common/descriptors';
import { getPrimaryCluster } from '../../../utils/UniverseUtils';
import { isEnabled } from '../../../utils/LayoutUtils';
import _ from 'lodash';

import './UniverseConnectModal.scss';


const mapDispatchToProps = (dispatch) => {
  return {
    showOverviewConnectModal: () => {
      dispatch(openDialog('UniverseConnectModal'));
    },
    closeModal: () => {
      dispatch(closeDialog());
    }
  };
};

function mapStateToProps(state) {
  return {
    currentCustomer: state.customer.currentCustomer,
    layout: state.customer.layout,
    universe: state.universe,
    modal: state.modal
  };
}

export const UniverseConnectModal = connect(mapStateToProps, mapDispatchToProps)((
  {
    universeInfo,
    currentCustomer,
    showOverviewConnectModal,
    closeModal,
    modal: { showModal, visibleModal },
    universe: { currentUniverse }
  }
) => {
  const [connectIp, setConnectIp] = useState('127.0.0.1');
  const [endpointName, setEndpointName]= useState(null);
  const [endpointPayload, setEndpointPayload]= useState('');
  const [endpointError, setEndpointError]= useState('');

  const renderEndpointUrl = (endpointUrl, endpointName) => {
    return (
      <YBButton
        btnClass={`btn btn-default ${endpointName === endpointName && 'active'}`}
        onClick={() => {handleEndpointCall(endpointUrl, endpointName)}}
        btnText={endpointName}
      />
    );
  };

  const handleEndpointCall = (endpointUrl, _endpointName) => {
    axios
      .get(endpointUrl)
      .then((response) => {

      })
      .catch(() =>{
        setEndpointPayload('');
        setEndpointName(_endpointName);
        setEndpointError(_endpointName + ' endpoint is unavailable')
      });
  };

  useEffect(() => {
    if (getPromiseState(currentUniverse).isSuccess() && isNonEmptyObject(currentUniverse.data)) {
      const universeInfo = currentUniverse.data;
      const universeUUID = universeInfo.universeUUID;

      const {
        universeDetails: { clusters }
      } = universeInfo;
      const primaryCluster = getPrimaryCluster(clusters);
      const userIntent = primaryCluster && primaryCluster.userIntent;

      const ycqlServiceUrl = getUniverseEndpoint(universeUUID) + '/ysqlservers';
      // check if there's a Hosted Zone
      if (userIntent.providerType === 'aws' && universeInfo.dnsName) {
        setConnectIp(
          universeInfo.dnsName.lastIndexOf('.') === universeInfo.dnsName.length - 1
            ? universeInfo.dnsName.substr(0, universeInfo.dnsName.length - 1)
            : universeInfo.dnsName
        );
        axios
          .get(ycqlServiceUrl)
          .then((response) =>{
            setEndpointName('YSQL');
            setEndpointPayload(response.data)
          })
          .catch(() => console.log('YCQL endpoint is unavailable'));
      } else {
        // if no go to YCQL endpoint and fetch IPs
        axios
          .get(ycqlServiceUrl)
          .then((response) =>{
            setEndpointName('YSQL');
            setEndpointPayload(response.data)
            setConnectIp(response.data.split(',')[0].trim().split(':')[0]);
          })
          .catch(() => console.log('YCQL endpoint is unavailable'));
      }
    }
  }, [currentUniverse])


  let content = null;
  if (getPromiseState(currentUniverse).isLoading() || getPromiseState(currentUniverse).isInit()) {
    content = <YBLoading />;
  }
  if (getPromiseState(currentUniverse).isSuccess() && isNonEmptyObject(currentUniverse.data)) {
    const universeInfo = currentUniverse.data;
    const {
      universeDetails: { clusters, communicationPorts }
    } = universeInfo;
    const primaryCluster = getPrimaryCluster(clusters);
    const userIntent = primaryCluster && primaryCluster.userIntent;
    const universeId = universeInfo.universeUUID;
    const ysqlRpcPort = _.get(communicationPorts, 'ysqlServerRpcPort', 5433);

    const ysqlServiceUrl = getUniverseEndpoint(universeId) + '/ysqlservers';
    const ycqlServiceUrl = getUniverseEndpoint(universeId) + '/yqlservers';
    const yedisServiceUrl = getUniverseEndpoint(universeId) + '/redisservers';
    const endpointsContent = (
      <Fragment>
        <FlexContainer className="btn-group-cnt endpoint-buttons">
          {(userIntent.enableYSQL ||
            isEnabled(currentCustomer.data.features, 'universe.defaultYSQL')) && (
            <FlexShrink>{renderEndpointUrl(ysqlServiceUrl, 'YSQL')}</FlexShrink>
          )}
          <FlexShrink>{renderEndpointUrl(ycqlServiceUrl, 'YCQL')}</FlexShrink>
          {(userIntent.enableYEDIS ||
            isEnabled(currentCustomer.data.features, 'universe.defaultYEDIS', 'disabled')) && (
            <FlexShrink>{renderEndpointUrl(yedisServiceUrl, 'YEDIS')}</FlexShrink>
          )}
        </FlexContainer>
        <YBCodeBlock
          className={'endpoint-output' + (endpointPayload === '' ? ' empty' : '')}
        >
          <YBCopyButton text={endpointPayload} />
          {endpointPayload} {endpointError}
        </YBCodeBlock>
      </Fragment>
    );

    content = (
      <>
        <h4>Services</h4>
        <YBCodeBlock>
          <table>
            <tbody>
              <tr>
                <td>JDBC</td>
                <td>:</td>
                <td title={`jdbc:postgresql://${connectIp}:${ysqlRpcPort}/yugabyte`}>
                  jdbc:postgresql://{connectIp}:{ysqlRpcPort}/yugabyte
                </td>
              </tr>
              {(userIntent.enableYSQL ||
                isEnabled(currentCustomer.data.features, 'universe.defaultYSQL')) && (
                <tr>
                  <td>YSQL Shell</td>
                  <td>: </td>
                  <td>bin/ysqlsh</td>
                </tr>
              )}
              <tr>
                <td>YCQL Shell</td>
                <td>: </td>
                <td>bin/ycqlsh</td>
              </tr>
              {(userIntent.enableYEDIS ||
                isEnabled(
                  currentCustomer.data.features,
                  'universe.defaultYEDIS',
                  'disabled'
                )) && (
                <tr>
                  <td>YEDIS Shell</td>
                  <td>: </td>
                  <td>bin/redis-cli</td>
                </tr>
              )}
            </tbody>
          </table>
        </YBCodeBlock>
        <h4 className="endpoints-heading">Endpoints</h4>
        {endpointsContent}
      </>
    );
  }
  return (
    <>
      <YBButton
        btnText={'Connect'}
        btnClass={'btn btn-orange'}
        onClick={showOverviewConnectModal}
      />
      <YBModal
        title={'Connect'}
        visible={showModal && visibleModal === 'UniverseConnectModal'}
        onHide={closeModal}
        showCancelButton={true}
        cancelLabel={'Close'}
      >
        {content}
      </YBModal>
    </>
  );
})
