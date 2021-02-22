// Copyright (c) YugaByte, Inc.

import React from 'react';
import { YBLoadingLinearIcon } from '../../indicators';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

const YBButtonLink =
({
   btnClass,
   btnText,
   btnIcon,
   btnSize,
   link,
   btnStyle,
   disabled,
   onClick,
   loading,
   ...otherProps
 }) => {
  const className = isDefinedNotNull(btnText) ? btnIcon : `${btnIcon} no-margin no-padding`;
  return (
    <a
      href={link}
      className={btnClass}
      onClick={onClick}
      style={btnStyle}
      disabled={disabled}
      {...otherProps}
    >
      {loading ? (
        <YBLoadingLinearIcon />
      ) : (
        <>
          <i className={className} />
          {btnText}
        </>
      )}
    </a>
  );
}

export default YBButtonLink;
