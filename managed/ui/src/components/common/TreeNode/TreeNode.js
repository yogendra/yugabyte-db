// Copyright (c) 2018 AppJudo Inc.  MIT License.

import React, {Component, useState} from 'react';
import { Collapse } from 'react-bootstrap';

import './TreeNode.scss';

const TreeNode = ({ defaultExpanded, header, body }) => {
  const [open, setOpen] = useState(defaultExpanded);

  const toggleOpen = () => { setOpen(!open) };

  return (
    <div className={`TreeNode ${open ? 'TreeNode-open' : 'TreeNode-closed'}`}>
      <div className="TreeNode-header" onClick={toggleOpen}>
        <i className={`fa fa-caret-${open ? 'down' : 'right'}`} />
        <div className="TreeNode-header-content">{header}</div>
      </div>
      <Collapse in={open}>
        <div>
          <div className="TreeNode-body">{body}</div>
        </div>
      </Collapse>
    </div>
  );
}

export default TreeNode;
