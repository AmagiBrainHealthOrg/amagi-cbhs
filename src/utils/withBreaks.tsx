import React from 'react'

export const withBreaks = (text: string) =>
  text.split('\n').map((line, index, lines) => (
    <React.Fragment key={index}>
      {line}
      {index < lines.length - 1 && <br />}
    </React.Fragment>
  ))
