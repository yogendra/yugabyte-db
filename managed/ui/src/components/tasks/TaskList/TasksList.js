// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect} from 'react';
import { TaskListTable } from '../../tasks';
import { showOrRedirect } from '../../../utils/LayoutUtils';

export const TasksList = (
  {
    fetchCustomerTasks,
    tasks: { customerTaskList },
    customer: { currentCustomer, INSECURE_apiToken }
  }
) =>{

  useEffect(() => {
    fetchCustomerTasks();
  }, []);

  showOrRedirect(currentCustomer.data.features, 'menu.tasks');
  const errorPlatformMessage = (
    <div className="oss-unavailable-warning">Only available on Yugabyte Platform.</div>
  );

  return (
    <TaskListTable
      taskList={customerTaskList || []}
      overrideContent={INSECURE_apiToken && errorPlatformMessage}
    />
  );
}
