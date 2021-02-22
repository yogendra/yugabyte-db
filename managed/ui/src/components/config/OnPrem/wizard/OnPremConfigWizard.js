// Copyright (c) YugaByte, Inc.

import React, { useState } from 'react';
import './OnPremConfigWizard.scss';
import {
  OnPremProviderAndAccessKeyContainer,
  OnPremMachineTypesContainer,
  OnPremRegionsAndZonesContainer
} from '../../../config';
import { Row, Col } from 'react-bootstrap';

const OnPremConfigWizard = (props) => {
  const [currentStep, setCurrentStep] = useState(0)

  const nextPage = () => {
    setCurrentStep(currentStep + 1)
  };

  const prevPage = () => {
    setCurrentStep(currentStep - 1)
  };

  let currentWizardStepContainer = <span />;
  if (currentStep === 0) {
    currentWizardStepContainer = (
      <OnPremProviderAndAccessKeyContainer {...props} nextPage={nextPage} />
    );
  } else if (currentStep === 1) {
    currentWizardStepContainer = (
      <OnPremMachineTypesContainer
        {...props}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    );
  } else if (currentStep === 2) {
    currentWizardStepContainer = (
      <OnPremRegionsAndZonesContainer
        {...props}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    );
  }
  const onPremStepperOptions = ['Provider Info', 'Instance Types', 'Regions and Zones'];
  return (
    <div>
      <OnPremStepper currentStep={currentStep} options={onPremStepperOptions}>
        {currentWizardStepContainer}
      </OnPremStepper>
    </div>
  );
}

export const OnPremStepper = ({ options, currentStep, children }) => {
  const optionsArraySize = options.length;
  const cellSize = 12 / optionsArraySize;
  let cellArray;
  if (currentStep >= optionsArraySize) {
    cellArray = <span />;
  } else {
    cellArray = options.map(function (item, idx) {
      return (
        <Col
          lg={cellSize}
          key={idx}
          className={`stepper-cell ${currentStep === idx ? 'active-stepper-cell' : ''}`}
        >
          {item}
        </Col>
      );
    });
  }
  return (
    <div>
      <Row className="stepper-container">{cellArray}</Row>
      {children}
    </div>
  );
}

export default OnPremConfigWizard;
