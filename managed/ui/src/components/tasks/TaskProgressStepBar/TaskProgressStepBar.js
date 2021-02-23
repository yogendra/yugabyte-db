// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StepProgressBar } from '../../common/indicators';
import { isValidObject } from '../../../utils/ObjectUtils';
import './TaskProgressStepBar.scss';

import { FlexContainer, FlexGrow, FlexShrink } from '../../common/flexbox/YBFlexBox';

export const TaskProgressStepBar = ({ progressData: { details }, progressData }) => {

  if (!isValidObject(details)) {
    return <span />;
  }

  const currentTaskDetail = details.taskDetails
    .filter((taskDetail) => taskDetail.state === 'Running')
    .map((taskDetail, idx) => (
      <div key={`taskdetail-{idx}`}>
        <h2>Current Step: {taskDetail.title}</h2>
        <div className="description-text">{taskDetail.description}</div>
      </div>
    ));

  return (
    <FlexContainer className="current-task">
      <FlexGrow className="current-task-progress clearfix">
        <h2>Task Progress</h2>
        <StepProgressBar progressData={progressData} />
      </FlexGrow>
      <FlexShrink className="current-task-details">{currentTaskDetail}</FlexShrink>
    </FlexContainer>
  );
}

TaskProgressStepBar.propTypes = {
  progressData: PropTypes.object.isRequired
};
