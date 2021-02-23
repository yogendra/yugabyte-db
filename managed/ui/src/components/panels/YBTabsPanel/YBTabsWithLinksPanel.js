// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Nav, NavItem, Tab } from 'react-bootstrap';
import { isDefinedNotNull } from '../../../utils/ObjectUtils';

export const YBTabsWithLinksPanel = withRouter(({ activeTab, defaultTab, location, routePrefix, router, children, id, className }) => {

  const tabSelect = (selectedKey) => {
    const currentLocation = location
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

  const activeTabKey = activeTab || queryTabHandler() || defaultTab;
  const links = children.map((item) => (
    <NavItem
      key={item.props.eventKey}
      eventKey={item.props.eventKey}
      href={item.props.eventKey}
      onClick={(e) => {
        e.preventDefault();
        tabSelect(item.props.eventKey);
      }}
    >
      {item.props.tabtitle || item.props.title}
    </NavItem>
  ));

  return (
    <Tab.Container
      defaultActiveKey={defaultTab}
      activeKey={activeTabKey}
      id={id}
      onSelect={tabSelect}
      className={className}
    >
      <div>
        <Nav bsStyle="tabs" className="nav nav-tabs">
          {links}
        </Nav>
        <Tab.Content animation>{children}</Tab.Content>
      </div>
    </Tab.Container>
  );
});

YBTabsWithLinksPanel.propTypes = {
  id: PropTypes.string.isRequired,
  activeTab: PropTypes.string,
  defaultTab: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string,
  routePrefix: PropTypes.string
};

