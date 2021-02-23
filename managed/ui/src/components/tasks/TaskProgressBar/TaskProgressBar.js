// Copyright (c) YugaByte, Inc.

import React, {useCallback} from 'react';
import PropTypes from 'prop-types';
import { ProgressBar } from 'react-bootstrap';

export const TaskProgressBar = (
  {
    progressData: { status, percent }
  }
) =>{

  const getStyleByStatus = useCallback(() =>{
    if (status === 'Failure') {
      return 'danger';
    } else if (status === 'Success') {
      return 'success';
    } else if (status === 'Running') {
      return 'info';
    }
    return null;
  }, [status])

  return (
    <ProgressBar now={percent} label={`${percent}%`} bsStyle={getStyleByStatus()} />
  );
}

TaskProgressBar.propTypes = {
  progressData: PropTypes.object.isRequired
};
