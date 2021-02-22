// Copyright (c) YugaByte, Inc.

import React from 'react';
import PropTypes from 'prop-types';

import './stylesheets/YBResourceCount.scss';

const YBResourceCount = ({ size, kind, unit, inline, pluralizeKind, className, pluralizeUnit, unitPlural, kindPlural  }) => {

  const pluralize = (unit) => {
    return unit + (unit.match(/s$/) ? 'es' : 's');
  }

  const displayUnit =
    unit && pluralizeUnit
      ? size === 1
        ? unit
        : unitPlural || pluralize(unit)
      : unit;
  const displayKind =
    kind && pluralizeKind
      ? size === 1
        ? kind
        : kindPlural || pluralize(kind)
      : kind;
  const classNames = (inline ? 'yb-resource-count-inline ' : null) + className;

  return (
    <div className={'yb-resource-count ' + classNames}>
      <div className="yb-resource-count-size">
        {size} {kind && inline && <div className="yb-resource-count-kind">{displayKind}</div>}
        {displayUnit && <span className="yb-resource-count-unit">{displayUnit}</span>}
      </div>
      {kind && !inline && <div className="yb-resource-count-kind">{displayKind}</div>}
    </div>
  );
}

YBResourceCount.propTypes = {
  kind: PropTypes.string,
  unit: PropTypes.string,
  className: PropTypes.string,
  pluralizeKind: PropTypes.bool,
  pluralizeUnit: PropTypes.bool,
  typePlural: PropTypes.string,
  unitPlural: PropTypes.string
};

YBResourceCount.defaultProps = {
  pluralizeKind: false,
  pluralizeUnit: false
};

export default YBResourceCount;
