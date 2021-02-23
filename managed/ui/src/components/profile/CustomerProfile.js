// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import { Tab } from 'react-bootstrap';
import { browserHistory } from 'react-router';
import { isNonAvailable, isDisabled, showOrRedirect, isNotHidden } from '../../utils/LayoutUtils';
import { YBTabsWithLinksPanel } from '../panels';
import { isDefinedNotNull } from '../../utils/ObjectUtils';
import { UserProfileForm } from './UserProfileForm';
import { AlertProfileForm } from './AlertProfileForm';
import { UserList } from './UserList';
import { YBLoading } from '../common/indicators';
import { getPromiseState } from '../../utils/PromiseUtils';

export const CustomerProfile = (props) => {
  const [statusUpdated, setStatusUpdated] = useState(false);
  const [updateStatus, setUpdateStatus] = useState('');
  const { customer = {}, apiToken, customerProfile, params, getCustomerUsers } = props;

  useEffect(()=> {
    getCustomerUsers();
    if (isNonAvailable(customer.features, 'main.profile')) browserHistory.push('/');
  }, []);

  const handleProfileUpdate = (status) => {
    setStatusUpdated(true);
    setUpdateStatus(status)
  };


  if (getPromiseState(customer).isLoading() || getPromiseState(customer).isInit()) {
    return <YBLoading />;
  }
  showOrRedirect(customer.data.features, 'main.profile');

  let profileUpdateStatus = <span />;
  if (statusUpdated) {
    if (updateStatus === 'updated-success') {
      profileUpdateStatus = (
        <span className="pull-right request-status yb-success-color yb-dissapear">
          Profile Updated Successfully
        </span>
      );
    } else {
      profileUpdateStatus = (
        <span className="pull-right request-status yb-fail-color yb-dissapear">
          Profile Update Failed
        </span>
      );
    }
    setTimeout(() => {
      setStatusUpdated(false)
    }, 2000);
  }

  const defaultTab = isNotHidden(customer.data.features, 'main.profile') ? 'general' : 'general';
  const activeTab = isDefinedNotNull(params) ? params.tab : defaultTab;
  return (
    <div className="bottom-bar-padding">
      <h2 className="content-title">Update Customer Profile {profileUpdateStatus}</h2>
      <YBTabsWithLinksPanel
        defaultTab={defaultTab}
        activeTab={activeTab}
        routePrefix={`/profile/`}
        id={'profile-tab-panel'}
        className="profile-detail"
      >
        {[
          <Tab.Pane
            eventKey={'general'}
            tabtitle="General"
            key="general-tab"
            mountOnEnter={true}
            unmountOnExit={true}
            disabled={isDisabled(customer.data.features, 'main.profile')}
          >
            <UserProfileForm
              customer={customer}
              customerProfile={customerProfile}
              apiToken={apiToken}
              handleProfileUpdate={handleProfileUpdate}
              {...props}
            />
          </Tab.Pane>,
          <Tab.Pane
            eventKey={'health-alerting'}
            tabtitle="Health & Alerting"
            key="health-alerting-tab"
            mountOnEnter={true}
            unmountOnExit={true}
            disabled={isDisabled(customer.data.features, 'main.profile')}
          >
            <AlertProfileForm
              customer={customer}
              customerProfile={customerProfile}
              apiToken={apiToken}
              handleProfileUpdate={handleProfileUpdate}
              {...props}
            />
          </Tab.Pane>,
          <Tab.Pane
            eventKey={'manage-users'}
            tabtitle="Users"
            key="manage-users"
            mountOnEnter={true}
            unmountOnExit={true}
            disabled={isDisabled(customer.data.features, 'main.profile')}
          >
            <UserList {...props} />
          </Tab.Pane>
        ]}
      </YBTabsWithLinksPanel>
    </div>
  );
}
