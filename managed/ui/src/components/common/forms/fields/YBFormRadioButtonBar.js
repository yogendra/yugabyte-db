// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect, useRef, useState} from 'react';
import { isObject } from 'lodash';
import { isNonEmptyArray, isDefinedNotNull } from '../../../../utils/ObjectUtils';
import YBFormRadioButton from './YBFormRadioButton';
import { YBLabel } from '../../descriptors';
import { Field } from 'formik';

const YBRadioButtonGroupDefault = ({ field, name, segmented, options, ...props }) => {
  return (
    <div
      className={'btn-group btn-group-radio' + (segmented ? ' btn-group-segmented' : '')}
      data-toggle="buttons"
    >
      {options.map((option) => {
        let value, label;
        if (isNonEmptyArray(option)) {
          [value, label] = option;
        } else if (isObject(option)) {
          value = option.value;
          label = option.label;
        } else {
          value = label = option;
        }
        const key = name + '_' + value;
        return (
          <Field
            component={YBFormRadioButton}
            key={key}
            id={value}
            name={name}
            label={label}
            segmented={segmented}
            {...props}
          />
        );
      })}
    </div>
  );
}

const YBRadioButtonGroup = ({ label, meta, type, ...otherProps }) => {
  if (isDefinedNotNull(label)) {
    return (
      <YBLabel label={label} meta={meta}>
        <YBRadioButtonGroupDefault {...otherProps} />
      </YBLabel>
    );
  } else {
    return <YBRadioButtonGroupDefault {...otherProps} />;
  }
}

const YBSegmentedButtonGroup = ({ label, meta, type, ...otherProps }) => {
  if (isDefinedNotNull(label)) {
    return (
      <YBLabel label={label} meta={meta}>
        <YBRadioButtonGroupDefault segmented={true} {...otherProps} />
      </YBLabel>
    );
  } else {
    return <YBRadioButtonGroupDefault segmented={true} {...otherProps} />;
  }
}


const YBRadioButtonLine = ({ onSelect, options, label, meta, ...otherProps }) => {
  const radioList = useRef();
  const [selectedOption, setSelectedOption] = useState(null);
  const [lineStyle, setLineStyle] = useState({});

  const handleSelect = (index) => {
    setSelectedOption(index);
    if (onSelect) {
      onSelect(options[index]);
    }
  };

  useEffect(() => {
    if (radioList.current) {
      const children = radioList.current.children;
      let width = 0;
      let left = 10;
      for (let i = 0; i < children.length; i++) {
        if (i === 0 && !label) {
          left = children[i].offsetWidth / 2;
        }
        if (i === children.length - 1) {
          width += children[i].offsetWidth / 2;
        } else {
          width += children[i].offsetWidth;
        }
      }
      setLineStyle( {
        left: `${left}px`,
        width: `${width}px`
      });
    }
  }, [radioList.current])


  return (
    <YBLabel label={label} meta={meta} classOverrides={'radio-bar'} {...otherProps}>
      <ul className="yb-form-radio" ref={radioList}>
        {options.map((value, index) => (
          <li key={`option-${index}`}>
            <input
              type="radio"
              id={`radio-option-${index}`}
              name="selector"
              checked={selectedOption === index}
              onChange={() => {handleSelect(index)}}
            />
            <div className="check" />
            <label htmlFor={`radio-options-${index}`} onClick={() => {handleSelect(index)}}>
              {value}
            </label>
          </li>
        ))}
      </ul>
      <div className={'connecting-line'} style={lineStyle} />
    </YBLabel>
  );
}

export default YBRadioButtonGroup;

export {
  YBRadioButtonGroup,
  YBSegmentedButtonGroup,
  YBRadioButtonLine
}
