// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Tabs } from 'react-bootstrap';
import { isDefinedNotNull } from '../../../utils/ObjectUtils';

export const YBTabsPanel = withRouter(({ activeTab, defaultTab, children, routePrefix, router, className, id, location }) =>{
  const tabSelect = (selectedKey) => {
    const currentLocation = location;
    if (routePrefix) {
      currentLocation.pathname = routePrefix + selectedKey;
    } else {
      currentLocation.query = currentLocation.query || {};
      currentLocation.query.tab = selectedKey;
    }
    router.push(currentLocation);
  };

  const queryTabHandler = () => {
    const locationTabKey = location.query.tab;
    if (isDefinedNotNull(locationTabKey)) {
      return children.some((item) => {
        return item.props.eventKey.indexOf(locationTabKey) >= 0 && !item.props.disabled;
      })
        ? locationTabKey
        : false;
    }
    return false;
  };

  const activeTabKey = activeTab || this.queryTabHandler() || defaultTab;
  return (
    <Tabs
      activeKey={activeTabKey}
      onSelect={this.tabSelect}
      id={id}
      className={className}
    >
      {children}
    </Tabs>
  );
});

YBTabsPanel.propTypes = {
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  defaultTab: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string,
  routePrefix: PropTypes.string
};
