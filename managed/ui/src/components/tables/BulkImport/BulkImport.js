// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { Field } from 'redux-form';
import { YBModal, YBTextInputWithLabel } from '../../common/forms/fields';
import {
  trimString,
  normalizeToPositiveInt,
  isDefinedNotNull,
  isNonEmptyObject
} from '../../../utils/ObjectUtils';
import { getPrimaryCluster } from '../../../utils/UniverseUtils';
import PropTypes from 'prop-types';

export const BulkImport = (
  {
    visible,
    onHide,
    tableInfo: { keySpace, tableName, tableID },
    handleSubmit,
    universeDetails,
    universeDetails: { universeUUID, clusters },
    bulkImport,
    tableInfo
  }
) => {
  const confirmBulkImport = (values) => {
    const primaryCluster = getPrimaryCluster(clusters);
    const instanceCount = isDefinedNotNull(values['instanceCount'])
      ? values['instanceCount']
      : primaryCluster.userIntent.numNodes * 8;
    const payload = {
      tableName: tableName,
      keyspace: keySpace,
      s3Bucket: values['s3Bucket'],
      instanceCount: instanceCount
    };
    onHide();
    bulkImport(universeUUID, tableID, payload);
  };


  if (!isNonEmptyObject(tableInfo)) {
    return <span />;
  }
  const s3label = 'S3 Bucket with data to be loaded into ' + keySpace + '.' + tableName;
  const primaryCluster = getPrimaryCluster(universeDetails.clusters);
  if (!isNonEmptyObject(primaryCluster)) {
    return <span />;
  }

  return (
    <div className="universe-apps-modal">
      <YBModal
        title={'Bulk Import into ' + keySpace + '.' + tableName}
        visible={visible}
        onHide={onHide}
        showCancelButton={true}
        cancelLabel={'Cancel'}
        onFormSubmit={handleSubmit(confirmBulkImport)}
      >
        <Field
          name="s3Bucket"
          component={YBTextInputWithLabel}
          label={s3label}
          placeHolder="s3://foo.bar.com/bulkload/"
          normalize={trimString}
        />
        <Field
          name="instanceCount"
          component={YBTextInputWithLabel}
          label={'Number of task instances for EMR job'}
          placeHolder={primaryCluster.userIntent.numNodes * 8}
          normalize={normalizeToPositiveInt}
        />
      </YBModal>
    </div>
  );
}

BulkImport.propTypes = {
  tableInfo: PropTypes.object
};
