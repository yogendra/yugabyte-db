// Copyright (c) YugaByte, Inc.

import React from 'react';
import './stylesheets/StepProgressBar.scss';

const StepProgressBar = ({
  details: { taskDetails }
}) => {
  const isFailedIndex = (taskDetails) => {
    return taskDetails.findIndex((element) => {
      return element.state === 'Failure';
    });
  };

  const isRunningIndex = (taskDetails) => {
    return taskDetails.findIndex((element) => {
      return element.state === 'Running';
    });
  };

  const normalizeTasks = (taskDetails) => {
    const taskDetailsNormalized = [
      ...taskDetails,
      {
        description: 'Universe created',
        state: 'Unknown',
        title: 'Done'
      }
    ];
    if (isFailedIndex(taskDetailsNormalized) > -1) {
      for (let i = 0; i < isFailedIndex(taskDetailsNormalized); i++) {
        taskDetailsNormalized[i].class = 'to-be-failed';
      }
    } else if (isRunningIndex(taskDetailsNormalized) > -1) {
      for (let i = 0; i < isRunningIndex(taskDetailsNormalized); i++) {
        taskDetailsNormalized[i].class = 'to-be-succeed';
      }
    } else {
      taskDetailsNormalized.forEachclass = 'finished';
      taskDetailsNormalized[taskDetailsNormalized.length - 1].class = 'finished';
    }
    return taskDetailsNormalized;
  };


  let taskClassName = '';
  const getTaskClass = function (type) {
    if (type === 'Initializing' || type === 'Unknown') {
      return 'pending';
    } else if (type === 'Success') {
      return 'finished';
    } else if (type === 'Running') {
      return 'running';
    } else if (type === 'Failure') {
      return 'failed';
    }
    return null;
  };

  const taskDetailsNormalized = normalizeTasks(taskDetails);

  const tasksTotal = taskDetailsNormalized.length;
  const taskIndex = taskDetailsNormalized.findIndex((element) => {
    return element.state === 'Running' || element.state === 'Failure';
  });

  const progressbarClass =
    isFailedIndex(taskDetailsNormalized) > -1
      ? 'failed'
      : isRunningIndex(taskDetailsNormalized) > -1
        ? 'running'
        : 'finished';
  const barWidth =
    taskIndex === -1
      ? '100%'
      : (100 * (taskIndex + (isFailedIndex(taskDetailsNormalized) > -1 ? 0 : 0.5))) /
          (tasksTotal - 1) +
        '%';

  const listLabels = taskDetailsNormalized.map(function (item, idx) {
    taskClassName = getTaskClass(item.state);
    return (
      <li key={idx} className={taskClassName + ' ' + item.class}>
        <span>{item.title}</span>
      </li>
    );
  }, this);
  return (
    <ul className="progressbar">
      <div
        className={
          'progressbar-bar ' +
          progressbarClass +
          ' ' +
          (taskIndex > -1 ? getTaskClass(taskDetailsNormalized[taskIndex].state) : '')
        }
        style={{ width: barWidth }}
      />
      {listLabels}
    </ul>
  );
}

export default StepProgressBar;
