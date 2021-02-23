// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect} from 'react';
import { isDefinedNotNull, isNonEmptyObject } from '../../utils/ObjectUtils';
import { showOrRedirect } from '../../utils/LayoutUtils';

export const YugawareLogs = ({ currentCustomer, yugawareLogs, logError, getLogs }) => {
  useEffect(() => {
    getLogs();
  }, []);

  showOrRedirect(currentCustomer.data.features, 'main.logs');

  let logContent = <span />;
  if (isDefinedNotNull(yugawareLogs) && isNonEmptyObject(yugawareLogs)) {
    logContent = <pre style={{ whiteSpace: 'pre-wrap' }}>{yugawareLogs.join('\n')}</pre>;
  }
  return (
    <div>
      <h2>
        <b>YugaWare logs</b>
      </h2>
      <div>{logError ? <div>Something went wrong fetching logs.</div> : logContent}</div>
    </div>
  );
}
