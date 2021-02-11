// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';
import { Popover, OverlayTrigger } from 'react-bootstrap';

const YBInfoTip = ({ content, placement, title, children }) =>{
  const id = 'popover-trigger-hover-focus';
  const popover = (
    <Popover className="yb-popover" id={id} title={title}>
      {content}
    </Popover>
  );
  return (
    <OverlayTrigger trigger={['hover', 'focus']} placement={placement} overlay={popover}>
      {children || <i className="fa fa-question-circle yb-help-color yb-info-tip" />}
    </OverlayTrigger>
  );
}

YBInfoTip.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  placement: PropTypes.oneOf(['left', 'right', 'top', 'bottom']),
  title: PropTypes.string
};

YBInfoTip.defaultProps = {
  placement: 'right',
  title: 'Info'
};

export default YBInfoTip;
