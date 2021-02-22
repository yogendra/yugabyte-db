// Copyright (c) YugaByte, Inc.

import { connect } from 'react-redux';
import { DataCenterConfiguration } from '../../config';

const mapStateToProps = ({ customer, universe, cloud }) => {
  return {
    customer,
    universe,
    cloud
  };
};

export default connect(mapStateToProps)(DataCenterConfiguration);
