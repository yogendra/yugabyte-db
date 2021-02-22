// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, ListGroupItem } from 'react-bootstrap';
import 'react-fa';

import './stylesheets/ProgressList.css';

const ProgressList = ({ items }) => {
  const getIconByType = (type) => {
    if (type === 'Initializing') {
      return 'fa fa-clock-o';
    } else if (type === 'Success') {
      return 'fa fa-check-square-o';
    } else if (type === 'Running') {
      return 'fa fa-spin fa-refresh';
    } else if (type === 'Error') {
      return 'fa fa-exclamation-circle';
    }
    return null;
  }

  const listItems = items.map(function (item, idx) {
    const iconType = getIconByType(item.type);
    return (
      <ListGroupItem key={`${idx}${item.type}`} bsClass="progress-list-item">
        <i className={iconType} />
        {item.name}
      </ListGroupItem>
    );
  }, this);

  return <ListGroup bsClass="progress-list">{listItems}</ListGroup>;
}

ProgressList.propTypes = {
  items: PropTypes.array.isRequired
};

ProgressList.defaultProps = {
  type: 'None'
};

export default ProgressList;
