// Copyright (c) YugaByte, Inc.

import React, { useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Grid, Row, Col, Tab } from 'react-bootstrap';
import { Link } from 'react-router';
import { TableInfoPanel, YBTabsPanel } from '../../panels';
import { RegionMap, YBMapLegend } from '../../maps';
import './TableDetail.scss';
import Measure from 'react-measure';
import { TableSchema } from '../../tables';
import { CustomerMetricsPanel } from '../../metrics';
import { isValidObject, isNonEmptyObject } from '../../../utils/ObjectUtils';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { getPrimaryCluster } from '../../../utils/UniverseUtils';

import { UniverseStatusContainer } from '../../universes';

export const TableDetail = (
  {
    customer,
    universe: { currentUniverse },
    tables: { currentTableDetail },
    universeUUID,
    tableUUID,
    fetchUniverseDetail,
    fetchTableDetail,
    resetTableDetail,
    resetUniverseDetail
  }
) => {
  const [dimensions, setDimensions] = useState({});

  useEffect(()=> {
    fetchUniverseDetail(universeUUID);
    fetchTableDetail(universeUUID, tableUUID);

    return () => {
      resetUniverseDetail();
      resetTableDetail()
    }
  }, []);

  const onResize = (_dimensions) => {
    setDimensions(_dimensions)
  }

  let tableInfoContent = <span />;
  const width = dimensions.width;
  if (getPromiseState(currentUniverse).isSuccess()) {
    const primaryCluster = getPrimaryCluster(currentUniverse.data.universeDetails.clusters);
    if (isNonEmptyObject(primaryCluster)) {
      tableInfoContent = (
        <div>
          <Row className={'table-detail-row'}>
            <Col lg={4}>
              <TableInfoPanel tableInfo={currentTableDetail} />
            </Col>
            <Col lg={8} />
          </Row>
          <Row>
            <Col lg={12}>
              <RegionMap regions={primaryCluster.regions} type={'Table'} />
              <YBMapLegend title="Placement Policy" regions={primaryCluster.regions} />
            </Col>
          </Row>
        </div>
      );
    }
  }
  let tableSchemaContent = <span />;
  if (isValidObject(currentTableDetail)) {
    tableSchemaContent = <TableSchema tableInfo={currentTableDetail} />;
  }
  let tableMetricsContent = <span />;
  if (
    isNonEmptyObject(currentUniverse) &&
    isNonEmptyObject(currentUniverse.data) &&
    isNonEmptyObject(currentTableDetail)
  ) {
    const nodePrefixes = [currentUniverse.data.universeDetails.nodePrefix];
    const tableName = currentTableDetail.tableDetails.tableName;
    tableMetricsContent = (
      <CustomerMetricsPanel
        origin={'table'}
        width={width}
        customer={customer}
        tableName={tableName}
        nodePrefixes={nodePrefixes}
      />
    );
  }
  const tabElements = [
    <Tab
      eventKey={'overview'}
      title="Overview"
      key="overview-tab"
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {tableInfoContent}
    </Tab>,
    <Tab
      eventKey={'schema'}
      title="Schema"
      key="tables-tab"
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {tableSchemaContent}
    </Tab>,
    <Tab
      eventKey={'metrics'}
      title="Metrics"
      key="metrics-tab"
      mountOnEnter={true}
      unmountOnExit={true}
    >
      {tableMetricsContent}
    </Tab>
  ];
  let tableName = '';
  if (isValidObject(currentTableDetail.tableDetails)) {
    tableName = (
      <>
        {currentTableDetail.tableDetails.keyspace}
        <strong>.</strong>
        <em>{currentTableDetail.tableDetails.tableName}</em>
      </>
    );
  }

  let universeState = <span />;

  const getUniverseInfo = () => {fetchUniverseDetail(universeUUID)}

  if (
    isNonEmptyObject(currentUniverse.data) &&
    isNonEmptyObject(currentTableDetail.tableDetails)
  ) {
    universeState = (
      <Col lg={10} sm={8} xs={6}>
        {/* UNIVERSE NAME */}
        <div className="universe-detail-status-container">
          <h2>
            <Link to={`/universes/${currentUniverse.data.universeUUID}`}>
              {currentUniverse.data.name}
            </Link>
            <span>
              <i className="fa fa-chevron-right" />
              <Link to={`/universes/${currentUniverse.data.universeUUID}/tables`}>Tables</Link>
              <i className="fa fa-chevron-right" />
              {tableName}
            </span>
          </h2>
          <UniverseStatusContainer
            currentUniverse={currentUniverse.data}
            showLabelText={true}
            refreshUniverseData={getUniverseInfo}
          />
        </div>
      </Col>
    );
  }

  return (
    <div className="dashboard-container">
      <Grid id="page-wrapper" fluid={true}>
        <Row className="header-row">{universeState}</Row>
        <Row>
          <Col lg={12}>
            <Measure onMeasure={onResize}>
              <YBTabsPanel defaultTab={'schema'} id={'tables-tab-panel'}>
                {tabElements}
              </YBTabsPanel>
            </Measure>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}

TableDetail.propTypes = {
  universeUUID: PropTypes.string.isRequired,
  tableUUID: PropTypes.string.isRequired
};
