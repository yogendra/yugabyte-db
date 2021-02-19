// Copyright (c) YugaByte, Inc.

import React from 'react';
import Universes from './Universes';
import { TableDetailContainer } from '../components/tables';

const TableDetail = ({ params: { uuid, tableUUID } }) => {
  return (
    <Universes>
      <TableDetailContainer
        universeUUID={uuid}
        tableUUID={tableUUID}
      />
    </Universes>
  );
};

export default TableDetail;
