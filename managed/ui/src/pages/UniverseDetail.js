// Copyright (c) YugaByte, Inc.

import React from 'react';

import { UniverseDetailContainer } from '../components/universes';

export const UniverseDetail = (props) => {
  return (
    <div>
      <UniverseDetailContainer uuid={props.params.uuid} {...props} />
    </div>
  );
};

export default UniverseDetail;
