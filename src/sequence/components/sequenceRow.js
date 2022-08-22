import React from 'react'

import {Nucleotide} from "./nucleotide";


/**
 * Renders a single row of `Nucleotide` values
 *
 * @param props.data {[char]} - Array of char values from nucleotide sequence
 * @param props.row {number} - Row index. Used in creating determining indices of `props.data` members
 *
 * @returns {JSX.Element}
 *
 * @constructor
 */
export default function SequenceRow(props) {
  const width = props.data.length;
  const num = width * props.row;

  return(
    <div className={'sequence-row'}>
      {props.data.map((value, column) => {
        let index = num + column;
        return <Nucleotide id={index} value={value} key={index}/>
      })}
    </div>
  )
}