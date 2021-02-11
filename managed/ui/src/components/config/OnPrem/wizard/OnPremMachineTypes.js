// Copyright (c) YugaByte, Inc.

import React, { useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';
import { Field, FieldArray } from 'redux-form';
import { YBInputField, YBButton } from '../../../common/forms/fields';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

export const OnPremListMachineTypes = ({ fields, isEditProvider }) => {
  if (fields.length === 0) {
    fields.push({});
  }

  const addMachineTypeRow = (e) => {
    if (isEditProvider) {
      fields.push({ isBeingEdited: true });
    } else {
      fields.push({});
    }
    e.preventDefault();
  };

  const removeMachineTypeRow = (idx) => {
    if (!isFieldReadOnly(idx)) {
      fields.remove(idx);
    }
  }

  const isFieldReadOnly = (fieldIdx) => {
    return (
      isEditProvider &&
      (!isDefinedNotNull(fields.get(fieldIdx).isBeingEdited) || !fields.get(fieldIdx).isBeingEdited)
    );
  }


  const removeRowButton = (fieldIdx) => {
    if (fields.length > 1) {
      return (
        <i
          className="fa fa-minus-circle on-prem-row-delete-btn"
          onClick={() => { removeMachineTypeRow(fieldIdx) }}
        />
      );
    }
    return <span />;
  };
  return (
    <div>
      {fields.map(function (fieldItem, fieldIdx) {
        const isReadOnly = isFieldReadOnly(fieldIdx);
        return (
          <Row key={`fieldMap${fieldIdx}`}>
            <Col lg={1}>{removeRowButton(fieldIdx)}</Col>
            <Col lg={3}>
              <Field
                name={`${fieldItem}.code`}
                component={YBInputField}
                insetError={true}
                isReadOnly={isReadOnly}
              />
            </Col>
            <Col lg={1}>
              <Field
                name={`${fieldItem}.numCores`}
                component={YBInputField}
                insetError={true}
                isReadOnly={isReadOnly}
              />
            </Col>
            <Col lg={1}>
              <Field
                name={`${fieldItem}.memSizeGB`}
                component={YBInputField}
                insetError={true}
                isReadOnly={isReadOnly}
              />
            </Col>
            <Col lg={1}>
              <Field
                name={`${fieldItem}.volumeSizeGB`}
                component={YBInputField}
                insetError={true}
                isReadOnly={isReadOnly}
              />
            </Col>
            <Col lg={4}>
              <Field
                name={`${fieldItem}.mountPath`}
                component={YBInputField}
                insetError={true}
                isReadOnly={isReadOnly}
              />
            </Col>
          </Row>
        );
      })}
      <Row>
        <Col lg={1}>
          <i
            className="fa fa-plus-circle fa-2x on-prem-row-add-btn"
            onClick={addMachineTypeRow}
          />
        </Col>
        <Col lg={3}>
          <a className="on-prem-add-link" onClick={addMachineTypeRow} href="/">
            Add Instance Type
          </a>
        </Col>
      </Row>
    </div>
  );
}

const OnPremMachineTypes = ({ submitOnPremMachineTypes, handleSubmit, prevPage, cancelEdit, switchToJsonEntry, isEditProvider }) => {
  const submitOnPremForm = (values) => {
    submitOnPremMachineTypes(values);
  };

  useEffect(() => {
    document.getElementById('onprem-machine-type-form').scrollIntoView(false);
  }, [])


  return (
    <div id="onprem-machine-type-form" className="on-prem-provider-form-container">
      <form name="onPremConfigForm" onSubmit={handleSubmit(submitOnPremMachineTypes)}>
        <div className="on-prem-form-text">
          Add one or more machine types to define your hardware configuration.
        </div>
        <div className="form-field-grid">
          <Row>
            <Col lg={3} lgOffset={1}>
              Machine Type
            </Col>
            <Col lg={1}>Num Cores</Col>
            <Col lg={1}>Mem Size GB</Col>
            <Col lg={1}>Vol Size GB</Col>
            <Col lg={4}>
              Mount Paths <span className="row-head-subscript">Comma Separated</span>
            </Col>
          </Row>
          <div className="on-prem-form-grid-container">
            <FieldArray
              name="machineTypeList"
              component={OnPremListMachineTypes}
              isEditProvider={isEditProvider}
            />
          </div>
        </div>
        <div className="form-action-button-container">
          {isEditProvider ? (
            <YBButton
              btnText={'Cancel'}
              btnClass={'btn btn-default save-btn cancel-btn'}
              onClick={cancelEdit}
            />
          ) : (
            <span />
          )}
          {switchToJsonEntry}
          <YBButton btnText={'Next'} btnType={'submit'} btnClass={'btn btn-default save-btn'} />
          <YBButton
            btnText={'Previous'}
            btnClass={'btn btn-default back-btn'}
            onClick={prevPage}
          />
        </div>
      </form>
    </div>
  );
}

export default OnPremMachineTypes;
