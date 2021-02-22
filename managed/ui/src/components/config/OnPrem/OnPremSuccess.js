// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import { Link, withRouter } from 'react-router';
import { cloneDeep, map, sortBy } from 'lodash';

import { YBButton } from '../../common/forms/fields';
import { Row, Col } from 'react-bootstrap';
import { getPromiseState } from '../../../utils/PromiseUtils';

import {
  isNonEmptyArray,
  isDefinedNotNull,
  isEmptyObject,
  pickArray,
  isNonEmptyObject
} from '../../../utils/ObjectUtils';
import { YBConfirmModal } from '../../modals';
import { DescriptionList } from '../../common/descriptors';
import { RegionMap, YBMapLegend } from '../../maps';
import OnPremNodesListContainer from './OnPremNodesListContainer';

const PROVIDER_TYPE = 'onprem';

const OnPremSuccess = (
  props
) => {
  const [manageInstances, setManageInstances] = useState(false);
  const [prevCloudBootstrap, setPrevCloudBootstrap] = useState(cloudBootstrap);
  const {
    accessKeys,
    cloud: { nodeInstanceList, instanceTypes, onPremJsonFormData },
    cloudBootstrap,
    cloudBootstrap: {
      data: { type, response }
    },
    configuredProviders,
    configuredRegions,
    deleteProviderConfig,
    fetchConfiguredNodeList,
    fetchInstanceTypeList,
    setOnPremJsonData,
    universeList,
    resetConfigForm,
    fetchCloudMetadata,
    showDeleteProviderModal,
    showEditProviderForm,
    hideDeleteProviderModal,
    visibleModal
  } = props;
  const deleteProvider = (uuid) => {
    deleteProviderConfig(uuid);
  }

  useEffect(()=>{
    const currentProvider = configuredProviders.data.find((provider) => provider.code === 'onprem');
    if (isDefinedNotNull(currentProvider)) {
      fetchConfiguredNodeList(currentProvider.uuid);
      fetchInstanceTypeList(currentProvider.uuid);
    }
  }, []);

  const getReadyState = (dataObject) => {
    return getPromiseState(dataObject).isSuccess() || getPromiseState(dataObject).isEmpty();
  };

  const handleManageNodesClick = () => {
    setManageInstances(true);
  };

  const showProviderView = () => {
    setManageInstances(false)
  };

  useEffect(() => {
    if (
      prevCloudBootstrap !== cloudBootstrap &&
      type === 'cleanup' &&
      isDefinedNotNull(response)
    ) {
      resetConfigForm();
      fetchCloudMetadata();
    }

    // setOnPremJSONFormData if not already set.
    if (
      isEmptyObject(onPremJsonFormData) &&
      getReadyState(nodeInstanceList) &&
      getReadyState(instanceTypes) &&
      getReadyState(accessKeys)
    ) {
      const onPremRegions = configuredRegions.data.filter(
        (configuredRegion) => configuredRegion.provider.code === PROVIDER_TYPE
      );
      const currentProvider = configuredProviders.data.find(
        (provider) => provider.code === 'onprem'
      );
      let onPremAccessKey = {};
      if (isNonEmptyArray(accessKeys.data)) {
        onPremAccessKey = accessKeys.data.find(
          (accessKey) => accessKey.idKey.providerUUID === currentProvider.uuid
        );
      }
      let keyJson = {};
      if (isNonEmptyObject(onPremAccessKey) && onPremAccessKey.idKey && onPremAccessKey.keyInfo) {
        const { idKey, keyInfo } = onPremAccessKey;
        keyJson = {
          code: idKey.keyCode,
          privateKeyContent: keyInfo.privateKey,
          sshUser: keyInfo.sshUser,
          sshPort: keyInfo.sshPort,
          airGapInstall: keyInfo.airGapInstall,
          installNodeExporter: keyInfo.installNodeExporter,
          nodeExporterUser: keyInfo.nodeExporterUser,
          nodeExporterPort: keyInfo.nodeExporterPort,
          preProvisionScript: keyInfo.provisionInstanceScript,
          skipProvisioning: keyInfo.skipProvisioning
        };
      }

      const jsonData = {
        provider: { name: currentProvider.name, config: currentProvider.config },
        key: keyJson,
        regions: onPremRegions.map((regionItem) => {
          return {
            code: regionItem.code,
            longitude: regionItem.longitude,
            latitude: regionItem.latitude,
            zones: regionItem.zones.map((zoneItem) => zoneItem.code)
          };
        }),
        instanceTypes: instanceTypes.data.map((instanceTypeItem) => ({
          instanceTypeCode: instanceTypeItem.instanceTypeCode,
          numCores: instanceTypeItem.numCores,
          memSizeGB: instanceTypeItem.memSizeGB,
          volumeDetailsList: pickArray(instanceTypeItem.instanceTypeDetails.volumeDetailsList, [
            'volumeSizeGB',
            'volumeType',
            'mountPath'
          ])
        })),
        nodes: nodeInstanceList.data.map((nodeItem) => ({
          ip: nodeItem.details.ip,
          region: nodeItem.details.region,
          zone: nodeItem.details.zone,
          instanceType: nodeItem.details.instanceType
        }))
      };
      setOnPremJsonData(jsonData);
    }
  }, [accessKeys, nodeInstanceList, instanceTypes, onPremJsonFormData, cloudBootstrap, cloudBootstrap, type, response, configuredProviders,
    configuredRegions])


  if (manageInstances) {
    return (
      <OnPremNodesListContainer
        {...props}
        showProviderView={showProviderView}
      />
    );
  }
  const currentProvider = configuredProviders.data.find(
    (provider) => provider.code === PROVIDER_TYPE
  );
  if (!currentProvider) {
    return <span />;
  }

  const nodesByRegionAndZone = {};
  nodeInstanceList.data.forEach((node) => {
    const region = node.details.region;
    const zone = node.details.zone;
    if (!nodesByRegionAndZone[region]) nodesByRegionAndZone[region] = {};
    if (!nodesByRegionAndZone[region][zone]) nodesByRegionAndZone[region][zone] = [];
    nodesByRegionAndZone[region][zone].push(node);
  });

  const onPremRegions = cloneDeep(
    configuredRegions.data.filter((region) => region.provider.code === PROVIDER_TYPE)
  );
  onPremRegions.forEach((region) => {
    region.zones.forEach((zone) => {
      zone.nodes =
        (nodesByRegionAndZone[region.name] && nodesByRegionAndZone[region.name][zone.name]) || [];
    });
  });

  let keyPairName = 'Not Configured';
  if (isNonEmptyArray(accessKeys.data)) {
    const onPremAccessKey = accessKeys.data.find(
      (accessKey) => accessKey.idKey.providerUUID === currentProvider.uuid
    );
    if (isDefinedNotNull(onPremAccessKey)) {
      keyPairName = onPremAccessKey.idKey.keyCode;
    }
  }

  const universeExistsForProvider = (universeList.data || []).some(
    (universe) => universe?.universeDetails?.clusters[0]?.userIntent.provider === currentProvider.uuid
  );
  const buttons = (
    <span className="buttons pull-right">
      <YBButton
        btnText="Delete Provider"
        disabled={universeExistsForProvider}
        btnIcon="fa fa-trash"
        btnClass={'btn btn-default yb-button delete-btn'}
        onClick={showDeleteProviderModal}
      />
      <YBButton
        btnText="Edit Provider"
        disabled={false}
        btnIcon="fa fa-pencil"
        btnClass={'btn btn-default yb-button'}
        onClick={showEditProviderForm}
      />
      <YBButton
        btnText="Manage Instances"
        disabled={false}
        btnIcon="fa fa-server"
        btnClass={'btn btn-default yb-button'}
        onClick={handleManageNodesClick}
      />
      <YBConfirmModal
        name="delete-aws-provider"
        title={'Confirm Delete'}
        onConfirm={() =>{ deleteProvider(currentProvider.uuid) }}
        currentModal="deleteOnPremProvider"
        visibleModal={visibleModal}
        hideConfirmModal={hideDeleteProviderModal}
      >
        Are you sure you want to delete this on-premises datacenter configuration?
      </YBConfirmModal>
    </span>
  );

  const editNodesLinkText = 'Setup Instances';
  const nodeItemObject = (
    <div>
      {nodeInstanceList.data.length}
      {(!nodeInstanceList.data.length && (
        <Link
          onClick={handleManageNodesClick}
          className="node-link-container"
          title={editNodesLinkText}
        >
          {editNodesLinkText}
        </Link>
      )) ||
        null}
    </div>
  );

  let regionLabels = <Col md={12}>No Regions Configured</Col>;
  if (isNonEmptyArray(onPremRegions)) {
    regionLabels = sortBy(onPremRegions, 'longitude').map((region) => {
      const zoneList = sortBy(region.zones, 'name').map((zone) => {
        const nodeIps = map(map(zone.nodes, 'details'), 'ip');
        return (
          <div key={`zone-${zone.uuid}`} className="zone">
            <div className="zone-name">{zone.name}:</div>
            <span title={nodeIps.join(', ')}>{zone.nodes.length} instances</span>
          </div>
        );
      });
      return (
        <Col key={`region-${region.uuid}`} md={3} lg={2} className="region">
          <div className="region-name">{region.name}</div>
          {zoneList}
        </Col>
      );
    });
  }

  const providerInfo = [
    { name: 'Name', data: currentProvider.name },
    { name: 'SSH Key', data: keyPairName },
    { name: 'Instances', data: nodeItemObject }
  ];
  return (
    <div className="provider-config-container">
      <Row className="config-section-header">
        <Col md={12}>
          {buttons}
          <DescriptionList listItems={providerInfo} />
        </Col>
      </Row>
      <Row className="yb-map-labels">{regionLabels}</Row>
      <Row>
        <Col lg={12} className="provider-map-container">
          <RegionMap
            title="All Supported Regions"
            regions={onPremRegions}
            type="Region"
            showRegionLabels={false}
            showLabels={true}
          />
          <YBMapLegend title="Region Map" />
        </Col>
      </Row>
    </div>
  );
}

export default withRouter(OnPremSuccess);
