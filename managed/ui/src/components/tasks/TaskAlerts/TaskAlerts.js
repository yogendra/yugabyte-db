// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { isNonEmptyArray } from '../../../utils/ObjectUtils';
import moment from 'moment';

import './TaskAlerts.scss';

export const AlertItem = ({ taskInfo }) => {
  let statusText = '';
  let statusVerbClassName = '';
  let statusIconClassName = '';
  if (taskInfo.status === 'Initializing') {
    statusText = 'Initializing';
    statusVerbClassName = 'yb-pending-color';
    statusIconClassName = 'fa-spinner fa-spin yb-pending-color';
  } else if (taskInfo.status === 'Running') {
    statusText = 'Pending';
    statusVerbClassName = 'yb-pending-color';
    statusIconClassName = 'fa-spinner fa-spin yb-pending-color';
  } else if (taskInfo.status === 'Success') {
    statusText = 'Completed';
    statusVerbClassName = 'yb-success-color';
    statusIconClassName = 'fa-check yb-success-color';
  } else if (taskInfo.status === 'Failure') {
    statusText = 'Failed';
    statusVerbClassName = 'yb-fail-color';
    statusIconClassName = 'fa-warning yb-fail-color';
  } else {
    statusText = 'Unknown';
    statusVerbClassName = 'yb-unknown-color';
    statusIconClassName = 'fa-exclamation yb-unknown-color';
  }

  const timeStampDifference = moment(taskInfo.createTime).fromNow();
  const [currentTask, universeName] = taskInfo.title.split(':');
  return (
    <div className="task-cell">
      <div className="icon icon-hang-left">
        <i className={`fa ${statusIconClassName}`} />
      </div>
      <div className="task-name">
        {currentTask} <span className="task-universe-name">{universeName}</span>
      </div>
      <div className="task-status">
        <span className={'task-status-verb ' + statusVerbClassName}>{statusText}</span>
        {timeStampDifference}
      </div>
    </div>
  );
}

AlertItem.propTypes = {
  taskInfo: PropTypes.object.isRequired
};

export const TaskAlerts = ({tasks: { customerTaskList }, fetchCustomerTasks, resetCustomerTasks}) => {
  useEffect(() => {
    fetchCustomerTasks();
    resetCustomerTasks()
  }, []);


  let tasksDisplayList = [];
  if (isNonEmptyArray(customerTaskList)) {
    const displayItems = customerTaskList.slice(0, 4);
    tasksDisplayList = displayItems.map((listItem, idx) => (
      <AlertItem key={`alertItem${idx}`} taskInfo={listItem} />
    ));
  }

  return (
    <div className="task-list-container">
      <div className="task-list-heading">
        <div className="icon icon-hang-left">
          <i className="fa fa-list" />
        </div>
        Tasks
      </div>
      {tasksDisplayList}
      <Link to="tasks" className="task-cell">
        Show All Tasks
      </Link>
    </div>
  );
}

TaskAlerts.propTypes = {
  eventKey: PropTypes.string.isRequired
};
