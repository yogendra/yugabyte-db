// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { TaskProgressBar, TaskProgressStepBar } from '..';
import { isValidObject } from '../../../utils/ObjectUtils';
import { YBLoading } from '../../common/indicators';
import { TASK_SHORT_TIMEOUT } from '../constants';
import { getPromiseState } from '../../../utils/PromiseUtils';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

export const TaskProgress = ({ taskUUIDs, taskProgressData, type, fetchTaskProgress, resetTaskProgress, onTaskSuccess, timeoutInterval }) => {
  const [prevTaskProgressData, setPrevTaskProgressData] = useState(taskProgressData);
  let timeout;
  useEffect(() => {
    if (taskUUIDs && taskUUIDs.length > 0) {
      // TODO, currently we only show one of the tasks, we need to
      // implement a way to show all the tasks against a universe
      fetchTaskProgress(taskUUIDs[0]);
    }

    return () => {
      resetTaskProgress();
    }
  }, []);

  useComponentDidUpdate(() => {
    if (
      taskProgressData !== prevTaskProgressData &&
      !getPromiseState(taskProgressData).isLoading()
    ) {
      clearTimeout(timeout);
      const { data } = taskProgressData;
      if (data.status === 'Success' && onTaskSuccess) {
        onTaskSuccess();
      }
      // Check to make sure if the current state is running
      if (isValidObject(data) && (data.status === 'Running' || data.status === 'Initializing')) {
        scheduleFetch();
      }
      setPrevTaskProgressData(taskProgressData);
    }
  }, [taskProgressData]);


  const scheduleFetch = () => {
    timeout = setTimeout(() => fetchTaskProgress(taskUUIDs[0]), timeoutInterval);
  }


  const taskProgressPromise = getPromiseState(taskProgressData);
  if (taskUUIDs.length === 0) {
    return <span />;
  } else if (taskProgressPromise.isLoading() || taskProgressPromise.isInit()) {
    return <YBLoading />;
  }
  if (type === 'StepBar') {
    return (
      <div className="provider-task-progress-container">
        <TaskProgressStepBar progressData={taskProgressData.data} />
      </div>
    );
  } else {
    return (
      <div className="provider-task-progress-container">
        <TaskProgressBar progressData={taskProgressData.data} />
      </div>
    );
  }
}

TaskProgress.contextTypes = {
  router: PropTypes.object
};

TaskProgress.propTypes = {
  taskUUIDs: PropTypes.array,
  type: PropTypes.oneOf(['Bar', 'StepBar']),
  timeoutInterval: PropTypes.number
};

TaskProgress.defaultProps = {
  type: 'Widget',
  timeoutInterval: TASK_SHORT_TIMEOUT
};
