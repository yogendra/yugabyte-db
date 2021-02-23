// Copyright (c) YugaByte, Inc.

import React, {Component, useCallback, useState} from 'react';
import { getPromiseState } from '../../../utils/PromiseUtils';
import 'react-bootstrap-multiselect/css/bootstrap-multiselect.css';
import { useHistory } from 'react-router-dom';
import { YBModal, YBCheckBox, YBTextInput } from '../../common/forms/fields';
import { isEmptyObject } from '../../../utils/ObjectUtils';
import { getReadOnlyCluster } from '../../../utils/UniverseUtils';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

export const DeleteUniverse = (
  {
    body,
    universe: {
      currentUniverse: {
        data: { name },
        data
      }
    },
    onHide,
    type,
    universe,
    fetchUniverseMetadata,
    visible,
    title,
    error,
    submitDeleteUniverse
  }
) => {
  const [isForceDelete, setIsForceDelete] = useState(false);
  const [universeName, setUniverseName] = useState(false);
  const [prevUniverse, setPrevUniverse] = useState(universe);
  const history = useHistory()
  const toggleForceDelete = () => {
    setIsForceDelete(!isForceDelete);
  };

  const onChangeUniverseName = (value) => {
    setUniverseName(value);
  };

  const closeDeleteModal = () => {
    onHide();
  };

  const getModalBody = useCallback(() => {
    return (
      <div>
        {body}
        <br />
        <br />
        <label>Enter universe name to confirm delete:</label>
        <YBTextInput
          label="Confirm universe name:"
          placeHolder={name}
          input={{ onChange: onChangeUniverseName, onBlur: () => {} }}
        />
      </div>
    );
  }, [body]);

  const confirmDelete = () => {
    onHide();
    if (type === 'primary') {
      submitDeleteUniverse(data.universeUUID, this.state.isForceDelete);
    } else {
      const cluster = getReadOnlyCluster(data.universeDetails.clusters);
      if (isEmptyObject(cluster)) return;
      this.props.submitDeleteReadReplica(cluster.uuid, data.universeUUID, this.state.isForceDelete);
    }
  };

  useComponentDidUpdate(() => {
    if (
      getPromiseState(prevUniverse.deleteUniverse).isLoading() &&
      getPromiseState(universe.deleteUniverse).isSuccess()
    ) {
      fetchUniverseMetadata();
      history.go('/universes')
    }
    setPrevUniverse(universe);
  }, [universe]);


  return (
    <YBModal
      visible={visible}
      formName={'DeleteUniverseForm'}
      onHide={onHide}
      submitLabel={'Yes'}
      cancelLabel={'No'}
      showCancelButton={true}
      title={title + name}
      onFormSubmit={confirmDelete}
      error={error}
      footerAccessory={
        <YBCheckBox
          label={'Ignore Errors and Force Delete'}
          className="footer-accessory"
          input={{ checked: isForceDelete, onChange: toggleForceDelete }}
        />
      }
      asyncValidating={universeName !== name}
    >
      {getModalBody()}
    </YBModal>
  );
}
