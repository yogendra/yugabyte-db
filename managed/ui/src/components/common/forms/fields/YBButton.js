// Copyright (c) YugaByte, Inc.

import React, { PureComponent, Fragment } from 'react';
import { Button } from 'react-bootstrap';
import { YBLoadingLinearIcon } from '../../indicators';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

const YBButton = ({
  btnClass,
  btnText,
  btnIcon,
  btnSize,
  btnType,
  btnStyle,
  disabled,
  loading,
  onClick,
  ...otherProps
}) => {

  const className = isDefinedNotNull(btnText) ? btnIcon : `${btnIcon} no-margin no-padding`;
  return (
    <Button
      bsClass={btnClass}
      type={btnType}
      onClick={onClick}
      bsSize={btnSize}
      bsStyle={btnStyle}
      disabled={disabled}
      {...otherProps}
    >
      {loading ? (
        <YBLoadingLinearIcon />
      ) : (
        <Fragment>
          {className && <i className={className} />}
          {btnText}
        </Fragment>
      )}
    </Button>
  );
};

export default YBButton;
