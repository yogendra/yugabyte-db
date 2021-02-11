// Copyright (c) YugaByte, Inc.

import React, { useEffect, useState} from 'react';
import { withRouter } from 'react-router';
import { isNonEmptyArray } from '../../utils/ObjectUtils';
import { getPromiseState } from '../../utils/PromiseUtils';
import { isHidden } from '../../utils/LayoutUtils';
import PropTypes from 'prop-types';
import {useComponentDidUpdate} from "../../hooks/useComponentDidUpdate";

const AuthenticatedComponent = ({
  fetchSoftwareVersions,
  fetchTableColumnTypes,
  getEBSListItems,
  getGCPListItems,
  getAZUListItems,
  getProviderListItems,
  getSupportedRegionList,
  getYugaWareVersion,
  fetchCustomerTasks,
  fetchCustomerCertificates,
  fetchCustomerConfigs,
  fetchInsecureLogin,
  resetUniverseList,
  fetchUniverseList,
  children,
  fetchMetadata,
  fetchUniverseMetadata,
  tasks,
  location,
  currentCustomer,
}) => {
  const [prevPath, setPrevPath] = useState('');
  const [fetchScheduled, setFetchScheduled] = useState(false);
  const [prevFetchMetadata, setPrevFetchMetadata] = useState(fetchMetadata)
  const [prevLocation, setPrevLocation] = useState(location)
  const [prevFetchUniverseMetadata, setPrevFetchUniverseMetadata] = useState(fetchUniverseMetadata)

  const getChildContext = () => {
    return { prevPath };
  }

  useEffect(() => {
    fetchSoftwareVersions();
    fetchTableColumnTypes();
    getEBSListItems();
    getGCPListItems();
    getAZUListItems();
    getProviderListItems();
    getSupportedRegionList();
    getYugaWareVersion();
    fetchCustomerTasks();
    fetchCustomerCertificates();
    fetchCustomerConfigs();
    fetchInsecureLogin();
    return () => {
      resetUniverseList()
    }
  }, []);

  const hasPendingCustomerTasks = (taskList) => {
    return isNonEmptyArray(taskList)
      ? taskList.some(
        (task) =>
          (task.status === 'Running' || task.status === 'Initializing') &&
          Number(task.percentComplete) !== 100
      )
      : false;
  };

  useComponentDidUpdate(() =>{
    if (prevFetchMetadata !== fetchMetadata && fetchMetadata) {
      getProviderListItems();
      fetchUniverseList();
      getSupportedRegionList();
      setPrevFetchMetadata(fetchMetadata);
    }
    if (
      prevFetchUniverseMetadata !== fetchUniverseMetadata && fetchUniverseMetadata
    ) {
      fetchUniverseList();
      setPrevFetchUniverseMetadata(fetchUniverseMetadata);
    }
    if (prevLocation !== location) {
      setPrevPath(prevLocation.pathname)
      setPrevLocation(location);
    }
    if (hasPendingCustomerTasks(tasks.customerTaskList) && !fetchScheduled) {
      this.scheduleFetch();
    }
  }, [fetchMetadata, fetchUniverseMetadata])


  const scheduleFetch = () => {
    function queryTasks() {
      const taskList = tasks.customerTaskList;
      // Check if there are still customer tasks in progress or if list is empty
      if (!hasPendingCustomerTasks(taskList) && isNonEmptyArray(taskList)) {
        setFetchScheduled(false);
      } else {
        fetchCustomerTasks().then(() => {
          setTimeout(queryTasks, 6000);
        });
      }
    }
    queryTasks();
    setFetchScheduled(true);
  };

  const sidebarHidden =
    getPromiseState(currentCustomer).isSuccess() &&
    isHidden(currentCustomer.data.features, 'menu.sidebar');
  return (
    <div
      className={sidebarHidden ? 'full-height-container sidebar-hidden' : 'full-height-container'}
    >
      {children}
    </div>
  );
}

export default withRouter(AuthenticatedComponent);

AuthenticatedComponent.childContextTypes = {
  prevPath: PropTypes.string
};
