// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect} from 'react';
import { Row, Col } from 'react-bootstrap';

import {
  UniverseRegionLocationPanelContainer,
  HighlightedStatsPanelContainer,
  UniverseDisplayPanelContainer
} from '../panels';
import './stylesheets/Dashboard.scss';
import { isAvailable, showOrRedirect } from '../../utils/LayoutUtils';

export const Dashboard = (props) => {
  const { customer: { currentCustomer }, fetchUniverseList } = props;
  useEffect(() => {
    fetchUniverseList();
  }, [])

  showOrRedirect(currentCustomer.data.features, 'menu.dashboard');

  return (
    <div id="page-wrapper">
      {isAvailable(currentCustomer.data.features, 'main.stats') && (
        <div className="dashboard-stats">
          <HighlightedStatsPanelContainer />
        </div>
      )}
      <UniverseDisplayPanelContainer {...props} />
      <Row>
        <Col lg={12}>
          <UniverseRegionLocationPanelContainer {...props} />
        </Col>
      </Row>
    </div>
  );
}
