// Copyright (c) YugaByte, Inc.

import React, { useState} from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';

const YBCopyButton = ({ text, options, className, children }) => {
  const [clicked, setClicked] = useState(false);

  const onClick = (event) => {
    event.preventDefault();
    copy(text, options);
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 2500);
  };

  const { caption, additionalClassName } = clicked
    ? { caption: 'Copied', additionalClassName: '' }
    : { caption: 'Copy', additionalClassName: ' btn-copy-inactive' };
  return (
    <button
      {...this.props}
      className={'btn btn-small btn-copy ' + className + additionalClassName}
      onClick={onClick}
    >
      {children || caption}
    </button>
  );
}

YBCopyButton.propTypes = {
  text: PropTypes.string.isRequired,
  options: PropTypes.shape({
    debug: PropTypes.bool,
    message: PropTypes.string
  })
};

export default YBCopyButton;
