// Copyright (c) YugaByte, Inc.

import React, {Component, useState} from 'react';
import { RegionMap } from '../../maps';
import { RegionMapLegend } from '../../maps';
import { isNonEmptyArray, isValidObject, isEmptyArray } from '../../../utils/ObjectUtils';
import { getPromiseState } from '../../../utils/PromiseUtils';
import { getPrimaryCluster, getProviderMetadata } from '../../../utils/UniverseUtils';
import {useComponentDidUpdate} from "../../../hooks/useComponentDidUpdate";

export const UniverseRegionLocationPanel = (
  {
    cloud,
    universe: { universeList },
    cloud: { providers }
  }
) => {
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [prevCloud, setPrevCloud] = useState(cloud);

  const onProviderSelect = (_selectedProviders) => {
    setSelectedProviders(_selectedProviders.map((provider) => provider.code))
  };

  useComponentDidUpdate(() => {
    if (
      isNonEmptyArray(cloud.providers.data) && (prevCloud.providers !== cloud.providers ||
        isEmptyArray(selectedProviders))
    ) {
      setSelectedProviders(cloud.providers.data.map((provider) => provider.code))
    }
    setPrevCloud(cloud);
  }, [cloud])


  if (
    getPromiseState(providers).isEmpty() ||
    !getPromiseState(cloud.supportedRegionList).isSuccess()
  ) {
    return <span />;
  }

  const completeRegionList = cloud.supportedRegionList.data.filter((region) =>
    selectedProviders.includes(region.provider.code)
  );
  const universeListByRegions = {};
  if (getPromiseState(universeList).isSuccess()) {
    universeList.data.forEach(function (universeItem) {
      const universePrimaryRegions = getPrimaryCluster(universeItem.universeDetails.clusters)
        .regions;
      if (isNonEmptyArray(universePrimaryRegions)) {
        universePrimaryRegions.forEach(function (regionItem) {
          if (isValidObject(regionItem.uuid)) {
            if (universeListByRegions.hasOwnProperty(regionItem.uuid)) {
              universeListByRegions[regionItem.uuid].push(universeItem);
            } else {
              universeListByRegions[regionItem.uuid] = [universeItem];
            }
          }
        });
      }
    });
  }
  completeRegionList.forEach(function (completeRegionItem, crIdx) {
    delete completeRegionList[crIdx].universes;
    Object.keys(universeListByRegions).forEach(function (regionKey) {
      if (regionKey === completeRegionItem.uuid) {
        completeRegionList[crIdx].universes = universeListByRegions[regionKey];
      }
    });
  });
  const completeProviderList = cloud.providers.data.map((provider) => {
    return getProviderMetadata(provider);
  });

  return (
    <div>
      <RegionMap title="All Supported Regions" regions={completeRegionList} type="All" />
      {isNonEmptyArray(completeProviderList) && (
        <RegionMapLegend
          providers={completeProviderList}
          onProviderSelect={onProviderSelect}
        />
      )}
    </div>
  );
}
