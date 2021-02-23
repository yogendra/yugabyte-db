import React from 'react';
import hljs from 'highlight.js/lib/highlight';
import json from 'highlight.js/lib/languages/json';
import sql from 'highlight.js/lib/languages/sql';

export const Highlighter = (props) => {
  const { text, type, element } = props
  if (type === 'json') {
    hljs.registerLanguage('json', json);
  } else if (type === 'sql') {
    hljs.registerLanguage('sql', sql);
  }

  if (element === 'pre') {
    return (
      <pre
        {...props}
        dangerouslySetInnerHTML={{
          __html: hljs.highlight(type, text).value
        }}
      />
    );
  }
  return (
    <div
      {...this.props}
      dangerouslySetInnerHTML={{
        __html: hljs.highlight(type, text).value
      }}
    />
  );
}
