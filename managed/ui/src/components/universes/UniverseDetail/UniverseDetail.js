// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useRef, useState} from 'react';
import { Link, withRouter, browserHistory } from 'react-router';
import { Grid, DropdownButton, MenuItem, Tab, Alert } from 'react-bootstrap';
import Measure from 'react-measure';
import { mouseTrap } from 'react-mousetrap';
import { CustomerMetricsPanel } from '../../metrics';
import { RollingUpgradeFormContainer } from '../../../components/common/forms';
import {
  UniverseFormContainer,
  UniverseStatusContainer,
  NodeDetailsContainer,
  DeleteUniverseContainer,
  UniverseAppsModal,
  UniverseOverviewContainerNew,
  EncryptionKeyModalContainer, UniverseConnectModal
} from '../../universes';
import { YBLabelWithIcon } from '../../common/descriptors';
import { YBTabsWithLinksPanel } from '../../panels';
import { ListTablesContainer, ListBackupsContainer, ReplicationContainer } from '../../tables';
import { LiveQueries } from '../../queries';
import { isEmptyObject, isNonEmptyObject } from '../../../utils/ObjectUtils';
import { isOnpremUniverse, isKubernetesUniverse } from '../../../utils/UniverseUtils';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { hasLiveNodes } from '../../../utils/UniverseUtils';
import { YBLoading, YBErrorIndicator } from '../../common/indicators';
import { UniverseHealthCheckList } from './compounds/UniverseHealthCheckList';
import { UniverseTaskList } from './compounds/UniverseTaskList';
import { YBMenuItem } from './compounds/YBMenuItem';
import { MenuItemsContainer } from './compounds/MenuItemsContainer';
import {
  isNonAvailable,
  isEnabled,
  isDisabled,
  isNotHidden,
  getFeatureState
} from '../../../utils/LayoutUtils';
import './UniverseDetail.scss';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

export const UniverseDetail = withRouter(mouseTrap((
  {
    customer: { currentCustomer },
    universe: { currentUniverse },
    universeTables,
    uuid,
    updateAvailable,
    modal,
    modal: { showModal, visibleModal },
    universe,
    tasks,
    location: { query, pathname },
    showSoftwareUpgradesModal,
    showTLSConfigurationModal,
    showRollingRestartModal,
    showRunSampleAppsModal,
    showGFlagsModal,
    showManageKeyModal,
    showDeleteUniverseModal,
    closeModal,
    customer,
    params: { tab },
    resetUniverseInfo,
    resetTablesList,
    location,
    universeSelectionId,
    getUniverseInfo,
    getAlertsList,
    getHealthCheck,
    bindShortcut,
    universeUUID,
    fetchUniverseTables,
    universe: { rollingUpgrade },
    router,
    params,
    fetchCustomerTasks,
    closeAlert
  }
) => {
  const [dimensions, setDimensions] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [actionsDropdownOpen, setActionsDropdownOpen] = useState(false);
  const [prevCurrentUniverse, setPrevCurrentUniverse] = useState(currentUniverse);
  const ybTabPanel = useRef();

  const hasReadReplica = (universeInfo) => {
    const clusters = universeInfo.universeDetails.clusters;
    return clusters.some((cluster) => cluster.clusterType === 'ASYNC');
  };

  useEffect(() => {

    if (isNonAvailable(currentCustomer.data.features, 'universes.details')) {
      if (isNonAvailable(currentCustomer.data.features, 'universes')) {
        browserHistory.push('/');
      } else {
        browserHistory.push('/universes/');
      }
    }

    bindShortcut(['ctrl+e', 'e'], onEditUniverseButtonClick);

    if (location.pathname !== '/universes/create') {
      let _uuid = uuid;
      if (typeof universeSelectionId !== 'undefined') {
        _uuid = universeUUID;
      }
      getUniverseInfo(_uuid);

      if (isDisabled(currentCustomer.data.features, 'universes.details.health')) {
        // Get alerts instead of Health
        getAlertsList();
      } else {
        getHealthCheck(_uuid);
      }
    }

    return () => {
      resetUniverseInfo();
      resetTablesList()
    }
  }, []);

  useComponentDidUpdate(() => {
    if (
      getPromiseState(currentUniverse).isSuccess() &&
      !getPromiseState(prevCurrentUniverse).isSuccess()
    ) {
      if (hasLiveNodes(currentUniverse.data) && !universeTables.length) {
        fetchUniverseTables(currentUniverse.data.universeUUID);
      }
      setPrevCurrentUniverse(currentUniverse);
    }
  }, [currentUniverse]);


  const onResize = (dimensions) =>{
    setDimensions(dimensions);
  }

  const onEditUniverseButtonClick = () => {
    const location = Object.assign({}, browserHistory.getCurrentLocation());
    Object.assign(location, { pathname: `/universes/${uuid}/edit/primary` });
    browserHistory.push(location);
  };

  const _getUniverseInfo = () => {
    const { universeUUID }= currentUniverse.data;
    getUniverseInfo(universeUUID);
  };

  const showUpgradeMarker = () => {
    if (!getPromiseState(rollingUpgrade).isLoading() && updateAvailable && !(showModal && visibleModal === 'softwareUpgradesModal')) {
      return true;
    }
    return false;
  };

  const transitToDefaultRoute = () => {
    const currentLocation = location;
    currentLocation.query = currentLocation.query.tab ? { tab: currentLocation.query.tab } : {};
    router.push(currentLocation);
  };

  const handleSubmitManageKey = (response) => {
    response.then((res) => {
      if (res.payload.isAxiosError) {
        setShowAlert(true);
        setAlertType('danger');
        setAlertMessage(res.payload.message)
      } else {
        setShowAlert(true);
        setAlertType('success');
        setAlertMessage('Encryption key has been set!')
      }
      setTimeout(() => setShowAlert(false), 3000);
    });

    closeModal();
  };

  const _closeAlert = () => {
    setShowAlert(false);
  };


  const isReadOnlyUniverse =
    getPromiseState(currentUniverse).isSuccess() &&
    currentUniverse.data.universeDetails.capability === 'READ_ONLY';

  const type =
    pathname.indexOf('edit') < 0
      ? 'Create'
      : params.type
        ? params.type === 'primary'
          ? 'Edit'
          : 'Async'
        : 'Edit';

  if (pathname === '/universes/create') {
    return <UniverseFormContainer type="Create" />;
  }

  if (getPromiseState(currentUniverse).isLoading() || getPromiseState(currentUniverse).isInit()) {
    return <YBLoading />;
  } else if (isEmptyObject(currentUniverse.data)) {
    return <span />;
  }

  if (type === 'Async' || (isNonEmptyObject(query) && query.edit && query.async)) {
    if (isReadOnlyUniverse) {
      // not fully legit but mandatory fallback for manually edited query
      transitToDefaultRoute();
    } else {
      return <UniverseFormContainer type="Async" />;
    }
  }

  if (type === 'Edit' || (isNonEmptyObject(query) && query.edit)) {
    if (isReadOnlyUniverse) {
      // not fully legit but mandatory fallback for manually edited query
      transitToDefaultRoute();
    } else {
      return <UniverseFormContainer type="Edit" />;
    }
  }

  if (getPromiseState(currentUniverse).isError()) {
    return <YBErrorIndicator type="universe" uuid={uuid} />;
  }

  const width = dimensions.width;
  const universeInfo = currentUniverse.data;
  const nodePrefixes = [currentUniverse.data.universeDetails.nodePrefix];
  const isItKubernetesUniverse = isKubernetesUniverse(currentUniverse.data);

  let editTLSAvailability = getFeatureState(
    currentCustomer.data.features,
    'universes.details.overview.manageEncryption'
  );
  // enable edit TLS menu item for onprem universes with rootCA of a "CustomCertHostPath" type
  if (isEnabled(editTLSAvailability)) {
    if (isOnpremUniverse(currentUniverse.data) && Array.isArray(customer.userCertificates.data)) {
      const rootCert = customer.userCertificates.data.find(
        item => item.uuid === currentUniverse.data.universeDetails.rootCA
      );
      if (rootCert?.certType !== 'CustomCertHostPath') editTLSAvailability = 'disabled';
    } else {
      editTLSAvailability = 'disabled';
    }
  }

  const defaultTab = isNotHidden(currentCustomer.data.features, 'universes.details.overview')
    ? 'overview'
    : 'overview';
  const activeTab = tab || defaultTab;
  const tabElements = [
    //common tabs for every universe
    ...[
      isNotHidden(currentCustomer.data.features, 'universes.details.overview') && (
        <Tab.Pane
          eventKey={'overview'}
          tabtitle="Overview"
          key="overview-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.overview')}
        >
          <UniverseOverviewContainerNew
            width={width}
            universe={universe}
            updateAvailable={updateAvailable}
            showSoftwareUpgradesModal={showSoftwareUpgradesModal}
            tabRef={ybTabPanel}
          />
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.tables') && (
        <Tab.Pane
          eventKey={'tables'}
          tabtitle="Tables"
          key="tables-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.tables')}
        >
          <ListTablesContainer />
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.nodes') && (
        <Tab.Pane
          eventKey={'nodes'}
          tabtitle={isItKubernetesUniverse ? 'Pods' : 'Nodes'}
          key="nodes-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.nodes')}
        >
          <NodeDetailsContainer />
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.metrics') && (
        <Tab.Pane
          eventKey={'metrics'}
          tabtitle="Metrics"
          key="metrics-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.metrics')}
        >
          <div className="universe-detail-content-container">
            <CustomerMetricsPanel
              customer={customer}
              origin={'universe'}
              width={width}
              nodePrefixes={nodePrefixes}
              isKubernetesUniverse={isItKubernetesUniverse}
            />
          </div>
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.queries') && (
        <Tab.Pane
          eventKey={"queries"}
          tabtitle="Queries"
          key="queries-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.queries')}
        >
          <LiveQueries />
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.replication') && (
        <Tab.Pane
          eventKey={'replication'}
          tabtitle="Replication"
          key="replication-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.replication')}
        >
          <ReplicationContainer />
        </Tab.Pane>
      ),

      isNotHidden(currentCustomer.data.features, 'universes.details.tasks') && (
        <Tab.Pane
          eventKey={'tasks'}
          tabtitle="Tasks"
          key="tasks-tab"
          mountOnEnter={true}
          unmountOnExit={true}
          disabled={isDisabled(currentCustomer.data.features, 'universes.details.tasks')}
        >
          <UniverseTaskList
            universe={universe}
            tasks={tasks}
            isCommunityEdition={!!customer.INSECURE_apiToken}
            fetchCustomerTasks={fetchCustomerTasks}
          />
        </Tab.Pane>
      )
    ],
    //tabs relevant for non-imported universes only
    ...(isReadOnlyUniverse
      ? []
      : [
        isNotHidden(currentCustomer.data.features, 'universes.details.backups') && (
          <Tab.Pane
            eventKey={'backups'}
            tabtitle="Backups"
            key="backups-tab"
            mountOnEnter={true}
            unmountOnExit={true}
            disabled={isDisabled(currentCustomer.data.features, 'universes.details.backups')}
          >
            <ListBackupsContainer currentUniverse={currentUniverse.data} />
          </Tab.Pane>
        ),

        isNotHidden(currentCustomer.data.features, 'universes.details.health') && (
          <Tab.Pane
            eventKey={'health'}
            tabtitle="Health"
            key="health-tab"
            mountOnEnter={true}
            unmountOnExit={true}
            disabled={isDisabled(currentCustomer.data.features, 'universes.details.heath')}
          >
            <UniverseHealthCheckList universe={universe} currentCustomer={currentCustomer} />
          </Tab.Pane>
        )
      ]
    )
  ].filter((element) => element);

  const currentBreadCrumb = (
    <div className="detail-label-small">
      <Link to="/universes">
        <YBLabelWithIcon>Universes</YBLabelWithIcon>
      </Link>
      <Link to={`/universes/${currentUniverse.data.universeUUID}`}>
        <YBLabelWithIcon icon="fa fa-angle-right fa-fw">
          {currentUniverse.data.name}
        </YBLabelWithIcon>
      </Link>
    </div>
  );

  return (
    <Grid id="page-wrapper" fluid={true} className={`universe-details universe-details-new`}>
      {showAlert && (
        <Alert bsStyle={alertType} onDismiss={closeAlert}>
          <h4>{alertType === 'success' ? 'Success' : 'Error'}</h4>
          <p>{alertMessage}</p>
        </Alert>
      )}
      {/* UNIVERSE NAME */}
      {currentBreadCrumb}
      <div className="universe-detail-status-container">
        <h2>{currentUniverse.data.name}</h2>
        <UniverseStatusContainer
          currentUniverse={currentUniverse.data}
          showLabelText={true}
          refreshUniverseData={getUniverseInfo}
        />
      </div>
      {isNotHidden(currentCustomer.data.features, 'universes.details.pageActions') && (
        <div className="page-action-buttons">
          {/* UNIVERSE EDIT */}
          <div className="universe-detail-btn-group">
            <UniverseConnectModal />

            <DropdownButton
              title="Actions"
              className={showUpgradeMarker() ? 'btn-marked' : ''}
              id="bg-nested-dropdown"
              pullRight
              onToggle={(isOpen) => { setActionsDropdownOpen(isOpen); }}
            >
              <MenuItemsContainer
                parentDropdownOpen={actionsDropdownOpen}
                mainMenu={(showSubmenu) => (
                  <>
                    <YBMenuItem
                      onClick={showSoftwareUpgradesModal}
                      availability={getFeatureState(
                        currentCustomer.data.features,
                        'universes.details.overview.upgradeSoftware'
                      )}
                    >
                      <YBLabelWithIcon icon="fa fa-arrow-up fa-fw">
                        Upgrade Software
                      </YBLabelWithIcon>
                      {showUpgradeMarker() && (
                        <span className="badge badge-pill badge-red pull-right">
                          {updateAvailable}
                        </span>
                      )}
                    </YBMenuItem>
                    {!isReadOnlyUniverse &&
                      isNotHidden(
                        currentCustomer.data.features,
                        'universes.details.overview.editUniverse'
                      ) && (
                      <YBMenuItem
                        to={`/universes/${uuid}/edit/primary`}
                        availability={getFeatureState(
                          currentCustomer.data.features,
                          'universes.details.overview.editUniverse'
                        )}
                      >
                        <YBLabelWithIcon icon="fa fa-pencil">Edit Universe</YBLabelWithIcon>
                      </YBMenuItem>
                    )}
                    <YBMenuItem
                      onClick={showGFlagsModal}
                      availability={getFeatureState(
                        currentCustomer.data.features,
                        'universes.details.overview.editGFlags'
                      )}
                    >
                      <YBLabelWithIcon icon="fa fa-flag fa-fw">Edit Flags</YBLabelWithIcon>
                    </YBMenuItem>

                    <YBMenuItem
                      onClick={() => showSubmenu('security')}
                      availability={getFeatureState(
                        currentCustomer.data.features,
                        'universes.details.overview.manageEncryption'
                      )}
                    >
                      <YBLabelWithIcon icon="fa fa-key fa-fw">Edit Security</YBLabelWithIcon>
                      <span className="pull-right">
                        <i className="fa fa-chevron-right submenu-icon" />
                      </span>
                    </YBMenuItem>

                    <YBMenuItem
                      onClick={showRollingRestartModal}
                      availability={getFeatureState(
                        currentCustomer.data.features,
                        'universes.details.overview.restartUniverse'
                      )}
                    >
                      <YBLabelWithIcon icon="fa fa-refresh fa-fw">
                        Initiate Rolling Restart
                      </YBLabelWithIcon>
                    </YBMenuItem>

                    {!isReadOnlyUniverse && (
                      <YBMenuItem
                        to={`/universes/${uuid}/edit/async`}
                        availability={getFeatureState(
                          currentCustomer.data.features,
                          'universes.details.overview.readReplica'
                        )}
                      >
                        <YBLabelWithIcon icon="fa fa-copy fa-fw">
                          {hasReadReplica(universeInfo) ? 'Edit' : 'Add'} Read Replica
                        </YBLabelWithIcon>
                      </YBMenuItem>
                    )}
                    <UniverseAppsModal
                      currentUniverse={currentUniverse.data}
                      modal={modal}
                      closeModal={closeModal}
                      button={
                        <YBMenuItem onClick={showRunSampleAppsModal}>
                          <YBLabelWithIcon icon="fa fa-terminal">Run Sample Apps</YBLabelWithIcon>
                        </YBMenuItem>
                      }
                    />
                    <MenuItem divider />
                    <YBMenuItem
                      onClick={showDeleteUniverseModal}
                      availability={getFeatureState(
                        currentCustomer.data.features,
                        'universes.details.overview.deleteUniverse'
                      )}
                    >
                      <YBLabelWithIcon icon="fa fa-trash-o fa-fw">
                        Delete Universe
                      </YBLabelWithIcon>
                    </YBMenuItem>
                  </>
                )}
                subMenus={{
                  security: (backToMainMenu) => (
                    <>
                      <MenuItem onClick={backToMainMenu}>
                        <YBLabelWithIcon icon="fa fa-chevron-left fa-fw">Back</YBLabelWithIcon>
                      </MenuItem>
                      <MenuItem divider />
                      <YBMenuItem
                        onClick={showTLSConfigurationModal}
                        availability={editTLSAvailability}
                      >
                        Encryption in-Transit
                      </YBMenuItem>
                      <YBMenuItem
                        onClick={showManageKeyModal}
                        availability={getFeatureState(
                          currentCustomer.data.features,
                          'universes.details.overview.manageEncryption'
                        )}
                      >
                        Encryption at-Rest
                      </YBMenuItem>
                    </>
                  )
                }}
              />
            </DropdownButton>
          </div>
        </div>
      )}
      <RollingUpgradeFormContainer
        modalVisible={
          showModal &&
          (visibleModal === 'gFlagsModal' ||
            visibleModal === 'softwareUpgradesModal' ||
            visibleModal === 'tlsConfigurationModal' ||
            visibleModal === 'rollingRestart')
        }
        onHide={closeModal}
      />
      <DeleteUniverseContainer
        visible={showModal && visibleModal === 'deleteUniverseModal'}
        onHide={closeModal}
        title="Delete Universe: "
        body="Are you sure you want to delete the universe? You will lose all your data!"
        type="primary"
      />

      <EncryptionKeyModalContainer
        modalVisible={showModal && visibleModal === 'manageKeyModal'}
        onHide={closeModal}
        handleSubmitKey={handleSubmitManageKey}
        currentUniverse={currentUniverse}
        name={currentUniverse.data.name}
        uuid={currentUniverse.data.universeUUID}
      />
      <Measure onMeasure={onResize}>
        <YBTabsWithLinksPanel
          defaultTab={defaultTab}
          activeTab={activeTab}
          routePrefix={`/universes/${currentUniverse.data.universeUUID}/`}
          id={'universe-tab-panel'}
          className="universe-detail"
        >
          {tabElements}
        </YBTabsWithLinksPanel>
      </Measure>
    </Grid>
  );
}));
