// Copyright (c) YugaByte, Inc.

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { YBSelect, YBInputField } from '../../../common/forms/fields';
import { Field } from 'redux-form';

const InstanceTypeForRegion = ({ fields, zoneOptions, machineTypeOptions, formType, useHostname }) => {
  if (fields.length === 0) {
    fields.push({});
  }

  const addRow = (e) => {
    fields.push({});
    e.preventDefault();
  };

  const removeRow = (instanceTypeIdx) => {
    fields.remove(instanceTypeIdx);
  }


  let addressType = useHostname ? 'Hostname' : 'IP Address';
  if (formType === 'modal') {
    addressType = useHostname ? 'Hostname' : 'IP Address';
  }

  return (
    <div className="instance-row-container">
      <Row>
        <Col lg={2} lgOffset={1}>
          Zone
        </Col>
        <Col lg={2}>Instance Type</Col>
        <Col lg={3}>
          Instance <span className="row-head-subscript">{addressType}</span>
        </Col>
        <Col lg={3}>
          Instance ID <span className="row-head-subscript">(Optional)</span>
        </Col>
      </Row>
      {fields.map((instanceTypeItem, instanceTypeIdx) => (
        <Row key={instanceTypeIdx}>
          <Col lg={1}>
            {fields.length > 1 ? (
              <i
                className="fa fa-minus-circle on-prem-row-delete-btn"
                onClick={() => {removeRow(instanceTypeIdx)}}
              />
            ) : null}
          </Col>
          <Col lg={2}>
            <Field
              name={`${instanceTypeItem}.zone`}
              component={YBSelect}
              insetError={true}
              options={zoneOptions}
            />
          </Col>
          <Col lg={2}>
            <Field
              name={`${instanceTypeItem}.machineType`}
              component={YBSelect}
              insetError={true}
              options={machineTypeOptions}
            />
          </Col>
          <Col lg={3}>
            <Field
              name={`${instanceTypeItem}.instanceTypeIP`}
              component={YBInputField}
              insetError={true}
            />
          </Col>
          <Col lg={3}>
            <Field
              name={`${instanceTypeItem}.instanceName`}
              component={YBInputField}
              insetError={true}
            />
          </Col>
        </Row>
      ))}
      <Row>
        <Col lg={1}>
          <i className="fa fa-plus-circle fa-2x on-prem-row-add-btn" onClick={addRow} />
        </Col>
        <Col lg={3}>
          <a className="on-prem-add-link" onClick={addRow} href="/">
            Add{' '}
          </a>
        </Col>
      </Row>
    </div>
  );
}

export default InstanceTypeForRegion;
