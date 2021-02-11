// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Highlighter } from '../../../../helpers/Highlighter';
import AceEditor from 'react-ace';
import { YBPanelItem } from '../../../panels';
import { YBButton } from '../../../common/forms/fields';
import sampleDataCenterConfig from '../../templates/SampleDataCenterConfig.json';

import 'ace-builds/src-noconflict/theme-github';
import 'highlight.js/styles/github-gist.css';

const ConfigFormTitle = ({ titleText, copyTextToForm }) => {
  return (
    <div className="sample-config-item-label">
      <Col lg={9} className="color-grey">
        {titleText}
      </Col>
      <Col lg={3} className="text-right">
        <YBButton
          btnIcon="fa fa-angle-double-right"
          btnText={'Use Template'}
          onClick={copyTextToForm}
        />
      </Col>
    </div>
  );
}

const OnPremConfigJSON = ({ updateConfigJsonVal, configJsonVal, switchToWizardEntry, submitJson  }) => {

  const sampleJsonPretty = JSON.stringify(sampleDataCenterConfig, null, 2);


  const onChange = (newValue) => {
    updateConfigJsonVal(newValue);
  };

  const copyTextToForm = () => {
    updateConfigJsonVal(sampleJsonPretty);
  };

  // Using Inline Styles because AceEditor is an SVG component
  // https://developer.mozilla.org/en-US/docs/Web/SVG
  const editorStyle = {
    width: '100%'
  };
  const configTitle = <h3>Enter Datacenter Configuration JSON:</h3>;
  return (
    <div>
      <Row className="form-data-container">
        <Col lg={5} className="sample-config-item">
          <Row className="color-light-grey">
            <ConfigFormTitle
              text={sampleJsonPretty}
              titleText={'Example Datacenter Configuration'}
              copyTextToForm={copyTextToForm}
            />
          </Row>
          <div className="onprem-config__json">
            <Highlighter type="json" text={sampleJsonPretty} element="pre" />
          </div>
        </Col>
        <Col lg={5} id="sample-panel-item">
          <YBPanelItem
            header={configTitle}
            body={
              <AceEditor
                theme="github"
                mode="json"
                onChange={onChange}
                name="dc-config-val"
                value={configJsonVal}
                style={editorStyle}
                editorProps={{ $blockScrolling: true }}
                showPrintMargin={false}
                wrapEnabled={true}
              />
            }
            hideToolBox={true}
          />
        </Col>
      </Row>
      <div>
        {switchToWizardEntry}
        <YBButton
          btnText={'Submit'}
          btnType={'submit'}
          btnClass={'btn btn-default save-btn pull-right'}
          onClick={submitJson}
        />
      </div>
    </div>
  );
}

export default OnPremConfigJSON;
