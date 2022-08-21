import React from 'react'

/**
 * Renders a single nucleotide
 * @param props.value {string} - Single nucleotide character
 * @param props.color {string} - Render color
 * @param props.selected {boolean} - Toggles styling for when component is selected
 *
 * @returns {JSX.Element}
 *
 * @constructor
 */
export function Nucleotide(props) {
  if (typeof(props.value) !== 'string' || props.value.length !== 1) {
    Error('Incorrect value passed to Nucleotide component')
  }
  return (
    <div className={'nucleotide'}>
      <span className={[
        props.color,
        props.selected ? 'selected' : null,
        ].join(' ')}>
        {props.value}
      </span>
    </div>
  )
}