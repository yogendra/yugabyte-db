// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import './stylesheets/NavBar.scss';

const NavBar = ({ customer, logoutProfile }) => {
  return (
    <div className="yb-nav-bar">
      <TopNavBar customer={customer} logoutProfile={logoutProfile} />
      <SideNavBar customer={customer} />
    </div>
  );
};

export default NavBar;
