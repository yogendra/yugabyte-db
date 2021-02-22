// Copyright (c) YugaByte, Inc.

import React, {Component, useEffect} from 'react';
import { FormControl } from 'react-bootstrap';
import { isFunction } from 'lodash';
import { YBLabel } from '../../../../components/common/descriptors';
import { isDefinedNotNull } from '../../../../utils/ObjectUtils';

// TODO: Make default export after checking all corresponding imports.
const YBTextInput =
(
  {
    input,
    type,
    className,
    placeHolder,
    onValueChanged,
    isReadOnly,
    normalizeOnBlur,
    initValue,
    onChange
  }
) => {

  useEffect(() => {
    if (isDefinedNotNull(initValue)) onChange(initValue);
  }, []);


  const onChangeLocal = (event) => {
    if (isFunction(onValueChanged)) {
      onValueChanged(event.target.value);
    }
    if (isDefinedNotNull(input) && isFunction(input.onChange)) {
      input.onChange(event.target.value);
    }
  }

  function onBlur(event) {
    if (isDefinedNotNull(input) && isFunction(input.onBlur)) {
      if (isFunction(normalizeOnBlur)) {
        input.onBlur(normalizeOnBlur(event.target.value));
      } else {
        input.onBlur(event.target.value);
      }
    }
  }

  return (
    <FormControl
      {...input}
      placeholder={placeHolder}
      type={type}
      className={className}
      onChange={onChangeLocal}
      readOnly={isReadOnly}
      onBlur={onBlur}
    />
  );
}

YBTextInput.defaultProps = {
  isReadOnly: false
};

const YBTextInputWithLabel =
(
  {
    label,
    meta,
    insetError,
    infoContent,
    infoTitle,
    infoPlacement,
    ...otherProps
  }
) => {
  return (
    <YBLabel
      label={label}
      meta={meta}
      insetError={insetError}
      infoContent={infoContent}
      infoTitle={infoTitle}
      infoPlacement={infoPlacement}
    >
      <YBTextInput {...otherProps} />
    </YBLabel>
  );
}


export class YBControlledTextInput extends Component {
  render() {
    const {
      label,
      meta,
      input,
      type,
      className,
      placeHolder,
      onValueChanged,
      isReadOnly,
      val,
      infoContent,
      infoTitle,
      infoPlacement
    } = this.props;
    return (
      <YBLabel
        label={label}
        meta={meta}
        infoContent={infoContent}
        infoTitle={infoTitle}
        infoPlacement={infoPlacement}
      >
        <FormControl
          {...input}
          placeholder={placeHolder}
          type={type}
          className={className}
          onChange={onValueChanged}
          readOnly={isReadOnly}
          value={val}
        />
      </YBLabel>
    );
  }
}

// TODO: Deprecated. Rename all YBInputField references to YBTextInputWithLabel.
export const YBInputField = YBTextInputWithLabel;
export default YBTextInputWithLabel;
export { YBTextInput };
