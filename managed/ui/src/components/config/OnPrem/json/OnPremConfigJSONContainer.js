// Copyright (c) YugaByte, Inc.

import { connect } from 'react-redux';
import { OnPremConfigJSON } from '../../../config';
import { setOnPremConfigData } from '../../../../actions/cloud';

const mapStateToProps = ({ cloud }) => {
  return {
    cloud
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setOnPremJsonData: (formData) => {
      dispatch(setOnPremConfigData(formData));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(OnPremConfigJSON);
