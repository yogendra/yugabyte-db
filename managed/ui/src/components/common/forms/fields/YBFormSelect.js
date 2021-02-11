// Copyright (c) YugaByte, Inc.

import React, { Component } from 'react';
import { YBLabel } from '../../../../components/common/descriptors';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

import Select from 'react-select';

const YBFormSelect = ({ form, field, onChange, ...rest }) => {
  const handleChange = (option) => {
    if (isDefinedNotNull(onChange) && typeof onChange === 'function') {
      onChange(this.props, option);
    } else if (isDefinedNotNull(option)) {
      form.setFieldValue(field.name, option);
    } else {
      form.setFieldValue(field.name, '');
    }
  };

  const handleBlur = () => {
    form.setFieldTouched(field.name, true);
  };
  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      padding: 10,
      backgroundColor: state.isFocused || state.isSelected ? '#e5e5e9' : 'white',
      color: '#333'
    }),
    control: (provided) => ({
      // none of react-select's styles are passed to <Control />
      ...provided,
      width: 'auto',
      borderColor: '#dedee0',
      borderRadius: 7,
      boxShadow: 'inset 0 1px 1px rgba(0, 0, 0, .075)',
      fontSize: '14px',
      minHeight: 42
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#999999'
    }),
    container: (provided) => ({
      ...provided
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 2
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    clearIndicator: (provided) => ({
      ...provided,
      cursor: 'pointer'
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    },
    multiValueRemove: (provided) => ({
      ...provided,
      borderRadius: '0 3px 3px 0'
    }),
    input: (provided) => ({
      ...provided,
      margin: '0'
    })
  };
  return (
    <YBLabel {...rest}>
      <Select
        className="Select"
        styles={customStyles}
        {...field}
        {...{form, ...rest}}
        onChange={handleChange}
        onBlur={handleBlur}
        value={field.value}
        isOptionDisabled={(option) => !!option.disabled}
      />
    </YBLabel>
  );
}

export default YBFormSelect;
