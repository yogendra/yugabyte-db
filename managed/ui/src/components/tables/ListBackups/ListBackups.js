// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { DropdownButton, Alert } from 'react-bootstrap';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import moment from 'moment';
import { YBPanelItem } from '../../panels';
import { YBCopyButton } from '../../common/descriptors';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { isAvailable } from '../../../utils/LayoutUtils';
import { timeFormatter, successStringFormatter } from '../../../utils/TableFormatters';
import { YBLoadingCircleIcon } from '../../common/indicators';
import { TableAction } from '../../tables';
import ListTablesModal from './ListTablesModal';
import SchedulesContainer from '../../schedules/SchedulesContainer';

import './ListBackups.scss';

const YSQL_TABLE_TYPE = 'PGSQL_TABLE_TYPE';
const YCQL_TABLE_TYPE = 'YQL_TABLE_TYPE';
const YEDIS_TABLE_TYPE = 'REDIS_TABLE_TYPE';

const getTableType = (text) => {
  switch (text) {
    case YSQL_TABLE_TYPE:
      return 'YSQL';
    case YCQL_TABLE_TYPE:
      return 'YCQL';
    case YEDIS_TABLE_TYPE:
      return 'YEDIS';
    default:
      return null;
  }
};
export const ListBackups = (
  {
    currentUniverse: { universeUUID },
    fetchUniverseBackups,
    fetchUniverseList,
    resetUniverseBackups,
    currentCustomer,
    currentUniverse,
    universeBackupList,
    universeTableTypes,
    title,

  }
) => {
  const [selectedRowList, setSelectedRowList] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [taskUUID, setTaskUUID] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    fetchUniverseBackups(universeUUID);
    fetchUniverseList();
    return () => {
      resetUniverseBackups();
    }
  }, []);

  const isMultiTableBackup = () => {
    return true;
  };

  const copyStorageLocation = (item, row) => {
    return <YBCopyButton text={item} title={item} />;
  };

  const openModal = (row) => {
    setSelectedRowList(row.tableNameList);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const parseTableType = (cell, rowData) => {
    if (rowData.backupType) {
      return getTableType(rowData.backupType);
    } else if (rowData.tableUUIDList || rowData.tableUUID) {
      return rowData.tableUUIDList
        ? universeTableTypes[rowData.tableUUIDList[0]]
        : universeTableTypes[rowData.tableUUID];
    } else if (rowData.keyspace) {
      if (rowData.keyspace.indexOf('ysql.') === 0) {
        return 'YSQL';
      } else {
        return 'YCQL';
      }
    }
  };

  const displayMultiTableNames = (cell, rowData) => {
    if (rowData.tableNameList && rowData.tableNameList.length) {
      if (rowData.tableNameList.length > 3) {
        // Display list of table names truncated if longer than 3
        const additionalTablesLink = (
          <strong className="bold-primary-link" onClick={() => openModal(rowData)}>
            {rowData.tableNameList.length - 3} more
          </strong>
        );

        return (
          <div>
            {rowData.tableNameList.slice(0, 3).join(', ')}, and {additionalTablesLink}
          </div>
        );
      }
      return rowData.tableNameList.join(', ');
    }
    return cell;
  };

  const renderCaret = (direction, fieldName) => {
    if (direction === 'asc') {
      return (
        <span className="order">
          <i className="fa fa-caret-up orange-icon" />
        </span>
      );
    }
    if (direction === 'desc') {
      return (
        <span className="order">
          <i className="fa fa-caret-down orange-icon" />
        </span>
      );
    }
    return (
      <span className="order">
        <i className="fa fa-caret-down orange-icon" />
        <i className="fa fa-caret-up orange-icon" />
      </span>
    );
  };

  const showMultiTableInfo = (row) => {
    let displayTableData = [{ ...row }];
    if (Array.isArray(row.backupList) && row.backupList.length) {
      return (
        <BootstrapTable
          data={row.backupList}
          className="backup-info-table"
          headerContainerClass="backup-header"
        >
          <TableHeaderColumn dataField="storageLocation" isKey={true} hidden={true} />
          <TableHeaderColumn
            dataField="keyspace"
            caretRender={renderCaret}
            dataSort
            dataAlign="left"
          >
            Keyspace
          </TableHeaderColumn>
          <TableHeaderColumn dataFormat={parseTableType} dataAlign="left">
            Backup Type
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="tableName"
            dataFormat={displayMultiTableNames}
            caretRender={renderCaret}
            dataSort
            dataAlign="left"
          >
            Table Name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="storageLocation"
            dataFormat={copyStorageLocation}
            dataSort
            dataAlign="left"
          >
            Storage Location
          </TableHeaderColumn>
        </BootstrapTable>
      );
    } else if (row.tableUUIDList && row.tableUUIDList.length) {
      const displayedTablesText =
        row.tableNameList.length > 3 ? (
          <div>
            {row.tableNameList.slice(0, 3).join(', ')}, and{' '}
            <strong className="bold-primary-link" onClick={() => openModal(row)}>
              {row.tableNameList.length - 3} more
            </strong>
          </div>
        ) : (
          row.tableNameList.join(', ')
        );
      displayTableData = [
        {
          keyspace: row.keyspace,
          tableName: displayedTablesText,
          tableUUID: row.tableUUIDList[0], // Tables can't be repeated so take first one as row key
          storageLocation: row.storageLocation
        }
      ];
    }

    return (
      <BootstrapTable
        data={displayTableData}
        className="backup-info-table"
        headerContainerClass="backup-header"
      >
        <TableHeaderColumn dataField="tableUUID" isKey={true} hidden={true} />
        <TableHeaderColumn
          dataField="keyspace"
          caretRender={renderCaret}
          dataSort
          dataAlign="left"
        >
          {row.backupType === YSQL_TABLE_TYPE ? 'Namespace' : 'Keyspace'}
        </TableHeaderColumn>
        <TableHeaderColumn dataFormat={parseTableType} dataAlign="left">
          Backup Type
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="tableName"
          caretRender={renderCaret}
          dataFormat={displayMultiTableNames}
          dataSort
          dataAlign="left"
        >
          Table Name
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="storageLocation"
          dataFormat={copyStorageLocation}
          dataAlign="left"
        >
          Storage Location
        </TableHeaderColumn>
      </BootstrapTable>
    );
  };

  const expandColumnComponent = ({ isExpandableRow, isExpanded }) => {
    if (isExpandableRow) {
      return isExpanded ? (
        <i className="fa fa-chevron-down" />
      ) : (
        <i className="fa fa-chevron-right" />
      );
    } else {
      return <span>&nbsp;</span>;
    }
  };

  const handleModalSubmit = (type, data) => {
    const taskUUID = data.taskUUID;
    setTaskUUID(taskUUID);
    setShowAlert(true);
    setAlertType(type)
    setTimeout(() => {
      setShowAlert(false);
    }, 4000);
  };

  const handleDismissAlert = () => {
    setShowAlert(false)
  };



  if (
    getPromiseState(universeBackupList).isLoading() ||
    getPromiseState(universeBackupList).isInit()
  ) {
    return <YBLoadingCircleIcon size="medium" />;
  }
  const backupInfos = universeBackupList.data
    .map((b) => {
      const backupInfo = b.backupInfo;
      if (backupInfo.actionType === 'CREATE') {
        backupInfo.backupUUID = b.backupUUID;
        backupInfo.status = b.state;
        backupInfo.createTime = b.createTime;
        backupInfo.expiry = b.expiry;
        backupInfo.updateTime = b.updateTime;
        if (backupInfo.tableUUIDList && backupInfo.tableUUIDList.length > 1) {
          backupInfo.tableName = backupInfo.tableNameList.join(', ');
          backupInfo.tableType = [
            ...new Set(backupInfo.tableUUIDList.map((v) => universeTableTypes[v]))
          ].join(', ');
        } else {
          backupInfo.tableType = universeTableTypes[b.backupInfo.tableUUID];
        }
        // Show action button to restore/delete only when the backup is
        // create and which has completed successfully.
        backupInfo.showActions =
          backupInfo.actionType === 'CREATE' && backupInfo.status === 'Completed';
        return backupInfo;
      }
      return null;
    })
    .filter(Boolean);

  const formatActionButtons = (item, row) => {
    if (row.showActions && isAvailable(currentCustomer.data.features, 'universes.backup')) {
      return (
        <DropdownButton
          className="btn btn-default"
          title="Actions"
          id="bg-nested-dropdown"
          pullRight
        >
          <TableAction
            currentRow={row}
            disabled={currentUniverse.universeDetails.backupInProgress}
            actionType="restore-backup"
            onSubmit={(data) => handleModalSubmit('Restore', data)}
            onError={() => handleModalSubmit('Restore')}
          />
          <TableAction
            currentRow={row}
            actionType="delete-backup"
            onSubmit={(data) => handleModalSubmit('Delete', data)}
            onError={() => handleModalSubmit('Delete')}
          />
        </DropdownButton>
      );
    }
  };

  const getBackupDuration = (item, row) => {
    const diffInMs = row.updateTime - row.createTime;
    return moment.duration(diffInMs).humanize();
  };

  const showBackupType = function (item, row) {
    if (row.backupList && row.backupList.length) {
      return (
        <div className="backup-type">
          <i className="fa fa-globe" aria-hidden="true" /> Universe backup
        </div>
      );
    } else if (row.tableUUIDList && row.tableUUIDList.length) {
      return (
        <div className="backup-type">
          <i className="fa fa-table" /> Multi-Table backup
        </div>
      );
    } else if (row.tableUUID) {
      return (
        <div className="backup-type">
          <i className="fa fa-file" /> Table backup
        </div>
      );
    } else if (row.keyspace != null) {
      const backupTableType =
        row.backupType === YSQL_TABLE_TYPE ? 'Namespace backup' : 'Keyspace backup';
      return (
        <div className="backup-type">
          <i className="fa fa-database" /> {backupTableType}
        </div>
      );
    }
  };
  return (
    <div id="list-backups-content">
      {currentUniverse.universeDetails.backupInProgress && (
        <Alert bsStyle="info">Backup is in progress at the moment</Alert>
      )}
      {showAlert && (
        <Alert bsStyle={taskUUID ? 'success' : 'danger'} onDismiss={handleDismissAlert}>
          {taskUUID ? (
            <div>
              {alertType} started successfully. See{' '}
              <Link to={`/tasks/${taskUUID}`}>task progress</Link>
            </div>
          ) : (
            `${alertType} task failed to initialize.`
          )}
        </Alert>
      )}
      <SchedulesContainer />
      <YBPanelItem
        header={
          <div className="container-title clearfix spacing-top">
            <div className="pull-left">
              <h2 className="task-list-header content-title pull-left">{title}</h2>
            </div>
            <div className="pull-right">
              {isAvailable(currentCustomer.data.features, 'universes.backup') && (
                <div className="backup-action-btn-group">
                  <TableAction
                    disabled={currentUniverse.universeDetails.backupInProgress || currentUniverse.universeConfig.takeBackups === "false"}
                    className="table-action"
                    btnClass="btn-orange"
                    actionType="create-backup"
                    isMenuItem={false}
                    onSubmit={(data) => handleModalSubmit('Backup', data)}
                    onError={() => handleModalSubmit('Backup')}
                  />
                  <TableAction
                    disabled={currentUniverse.universeDetails.backupInProgress}
                    className="table-action"
                    btnClass="btn-default"
                    actionType="restore-backup"
                    isMenuItem={false}
                    onSubmit={(data) => handleModalSubmit('Restore', data)}
                    onError={() => handleModalSubmit('Restore')}
                  />
                </div>
              )}
            </div>
          </div>
        }
        body={
          <BootstrapTable
            data={backupInfos}
            pagination={true}
            className="backup-list-table"
            expandableRow={isMultiTableBackup}
            expandComponent={showMultiTableInfo}
            expandColumnOptions={{
              expandColumnVisible: true,
              expandColumnComponent,
              columnWidth: 50
            }}
            options={{
              expandBy: 'column'
            }}
          >
            <TableHeaderColumn dataField="backupUUID" isKey={true} hidden={true} />
            <TableHeaderColumn
              dataField={'backupType'}
              dataFormat={showBackupType}
              expandable={false}
            >
              Type
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="createTime"
              dataFormat={timeFormatter}
              dataSort
              columnClassName="no-border "
              className="no-border"
              expandable={false}
              dataAlign="left"
            >
              Created At
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="expiry"
              dataFormat={timeFormatter}
              dataSort
              columnClassName="no-border "
              className="no-border"
              expandable={false}
              dataAlign="left"
            >
              Expiry Time
            </TableHeaderColumn>
            <TableHeaderColumn
              dataFormat={getBackupDuration}
              dataSort
              columnClassName="no-border "
              className="no-border"
              expandable={false}
              dataAlign="left"
            >
              Duration
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField="status"
              dataSort
              expandable={false}
              columnClassName="no-border name-column"
              className="no-border"
              dataFormat={successStringFormatter}
            >
              Status
            </TableHeaderColumn>
            <TableHeaderColumn
              dataField={'actions'}
              columnClassName={'no-border yb-actions-cell'}
              className={'no-border yb-actions-cell'}
              dataFormat={formatActionButtons}
              headerAlign="center"
              dataAlign="center"
              expandable={false}
            >
              Actions
            </TableHeaderColumn>
          </BootstrapTable>
        }
      />
      <ListTablesModal
        visible={showModal}
        data={selectedRowList}
        title={'Tables in backup'}
        onHide={closeModal}
      />
    </div>
  );
}

ListBackups.defaultProps = {
  title: 'Backups'
};

ListBackups.propTypes = {
  currentUniverse: PropTypes.object.isRequired
};
