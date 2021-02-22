// Copyright (c) YugaByte, Inc.

import React, {Component, useState} from 'react';
import { Field } from 'redux-form';
import { Row, Col } from 'react-bootstrap';
import { YBInputField, YBButton, YBTextArea, YBNumericInput } from '../../../common/forms/fields';
import constants from './OnPremWizardConstants.json';
import YBToggle from '../../../common/forms/fields/YBToggle';

const OnPremProviderAndAccessKey = ({ cancelEdit, initialValues, setOnPremProviderAndAccessKey, handleSubmit, switchToJsonEntry, isEditProvider }) => {
  const [privateKeyFile, setPrivateKeyFile] = useState({});
  const [installNodeExporter, setInstallNodeExporter] = useState(initialValues.installNodeExporter);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const submitProviderKeyForm = (vals) => {
    setOnPremProviderAndAccessKey(vals);
  };

  const privateKeyUpload = (val) => {
    setPrivateKeyFile(val[0]);
  };

  const toggleInstallNodeExporter = () => {
    setInstallNodeExporter(!installNodeExporter);
  }

  const toggleShowAdvanced = () => {
    setShowAdvanced(!showAdvanced);
  }

  const {
    nameHelpContent,
    userHelpContent,
    pkHelpContent,
    skipProvisioningHelp,
    airGapInstallHelp,
    portHelpContent,
    useHostnameHelp
  } = constants;
  const isReadOnly = isEditProvider;

  return (
    <div className="on-prem-provider-form-container">
      <form name="onPremConfigForm" onSubmit={handleSubmit(submitProviderKeyForm)}>
        <Row>
          <Col lg={6}>
            <div className="form-right-aligned-labels">
              <Field
                name="name"
                component={YBInputField}
                label="Provider Name"
                insetError={true}
                isReadOnly={isReadOnly}
                infoContent={nameHelpContent}
                infoTitle="Provider Name"
              />
              <Field
                name="sshUser"
                component={YBInputField}
                label="SSH User"
                insetError={true}
                isReadOnly={isReadOnly}
                infoContent={userHelpContent}
                infoTitle="SSH User"
              />
              <Field
                name="sshPort"
                component={YBNumericInput}
                label="SSH Port"
                insetError={true}
                readOnly={isReadOnly}
                infoContent={portHelpContent}
                infoTitle="SSH Port"
              />
              <Field
                name="skipProvisioning"
                component={YBToggle}
                label="Manually Provision Nodes"
                defaultChecked={false}
                isReadOnly={isReadOnly}
                infoContent={skipProvisioningHelp}
                infoTitle="Manually Provision Nodes"
              />
              <Field
                name="privateKeyContent"
                component={YBTextArea}
                label="SSH Key"
                insetError={true}
                className="ssh-key-container"
                isReadOnly={isReadOnly}
                infoContent={pkHelpContent}
                infoTitle="SSH Key"
              />
              <Field
                name="airGapInstall"
                component={YBToggle}
                isReadOnly={isReadOnly}
                label="Air Gap Install"
                defaultChecked={false}
                infoContent={airGapInstallHelp}
                infoTitle="Air Gap Installation"
              />
              <Field
                name="advanced"
                component={YBToggle}
                label="Advanced"
                defaultChecked={false}
                isReadOnly={false}
                onToggle={toggleShowAdvanced}
                checkedVal={showAdvanced}
              />
              {showAdvanced && (
                <Field
                  name="useHostnames"
                  component={YBToggle}
                  label="Use Hostnames"
                  defaultChecked={false}
                  isReadOnly={isReadOnly}
                  infoContent={useHostnameHelp}
                  infoTitle="Use Hostnames"
                />
              )}
              {showAdvanced && (
                <Field
                  name="homeDir"
                  component={YBTextArea}
                  isReadOnly={isReadOnly}
                  label="Desired Home Directory"
                  insetError={true}
                  subLabel="Enter the desired home directory for YB nodes (optional)."
                />
              )}
              {showAdvanced && (
                <Field
                  name="nodeExporterPort"
                  component={YBNumericInput}
                  label="Node Exporter Port"
                  readOnly={isReadOnly}
                  insetError={true}
                />
              )}
              {showAdvanced && (
                <Field
                  name="installNodeExporter"
                  component={YBToggle}
                  label="Install Node Exporter"
                  defaultChecked={true}
                  isReadOnly={isReadOnly}
                  onToggle={toggleInstallNodeExporter}
                  checkedVal={installNodeExporter}
                  subLabel="Whether to install or skip installing Node Exporter."
                />
              )}
              {showAdvanced && installNodeExporter && (
                <Field
                  name="nodeExporterUser"
                  component={YBTextArea}
                  label="Node Exporter User"
                  isReadOnly={isReadOnly}
                  insetError={true}
                />
              )}
            </div>
          </Col>
        </Row>
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
        </div>
      </form>
    </div>
  );
}

export default OnPremProviderAndAccessKey
