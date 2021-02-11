// Copyright YugaByte Inc.

import { NodeActionModal } from '../../universes';
import { connect } from 'react-redux';

import {
  fetchUniverseInfo,
  fetchUniverseInfoResponse,
  getUniversePerNodeStatus,
  getUniversePerNodeStatusResponse,
  performUniverseNodeAction,
  performUniverseNodeActionResponse
} from '../../../actions/universe';

function mapStateToProps(state) {
  return {
    universe: state.universe
  };
}

const nodeActionExpectedResult = {
  START: 'Live',
  STOP: 'Stopped',
  REMOVE: 'Unreachable',
  RELEASE: 'Unreachable',
  DELETE: 'Unreachable'
};

const mapDispatchToProps = (dispatch) => {
  return {
    performUniverseNodeAction: (universeUUID, nodeName, actionType) => {
      dispatch(performUniverseNodeAction(universeUUID, nodeName, actionType)).then((response) => {
        dispatch(performUniverseNodeActionResponse(response.payload));
        const interval = setInterval(() => {
          dispatch(getUniversePerNodeStatus(universeUUID)).then((response) => {
            if(response.payload && response.payload.data) {
              const node = response.payload.data[nodeName];
              if(actionType === 'DELETE') {
                clearInterval(interval);
              }
              if(node.node_status === nodeActionExpectedResult[actionType]) {
                clearInterval(interval);
              }
              dispatch(getUniversePerNodeStatusResponse(response.payload));
            }
          });
        }, 2500);
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NodeActionModal);
