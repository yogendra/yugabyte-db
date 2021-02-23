// Copyright (c) YugaByte, Inc.

import React from 'react';

export const YBFormCheckboxGroup = ({ value, error, touched, label, className, children, onBlur, id }) => {
  const handleChange = (event) => {
    const target = event.currentTarget;
    const valueArray = [...value] || [];

    if (target.checked) {
      valueArray.push(target.id);
    } else {
      valueArray.splice(valueArray.indexOf(target.id), 1);
    }

    this.props.onChange(this.props.id, valueArray);
  };

  const handleBlur = () => {
    // take care of touched
    onBlur(id, true);
  };


  const classes = classNames(
    'input-field',
    {
      'is-success': value || (!error && touched), // handle prefilled or user-filled
      'is-error': !!error && touched
    },
    className
  );

  return (
    <div className={classes}>
      <fieldset>
        <legend>{label}</legend>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            field: {
              value: value.includes(child.props.id),
              onChange: this.handleChange,
              onBlur: this.handleBlur
            }
          });
        })}
        {touched && <InputFeedback error={error} />}
      </fieldset>
    </div>
  );
}
