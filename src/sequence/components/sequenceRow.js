import React from 'react'

import {withinBounds} from "../helpers";
import {SequenceContext} from "../data";
import {Nucleotide} from "./nucleotide";


/**
 * Renders a single row of `Nucleotide` values
 *
 * @param props.data {[char]} - Array of char values from nucleotide sequence
 * @param props.row {number} - Row index. Used in creating determining indices of `props.data` members
 * @param props.width {number} - Global width of `SequenceText`
 *
 * @returns {JSX.Element}
 *
 * @constructor
 */
export default class SequenceRow extends React.Component {
  static contextType = SequenceContext;

  constructor(props, context) {
    super(props, context);

    this.basis = this.props.width * props.row;    // basis of row. Adding index of `props.data` derives index of each element
  }

  render() {
    return (
      <div className={[
        'sequence-row',
      ].join(' ')}>

        {this.props.data.map((value, column) => {
          let index = this.basis + column;
          return <Nucleotide index={index}
                             key={index}
                             value={value}
                             highlighted={this.context.highlighted ? withinBounds(index,
                               this.context.highlighted.location) : false}/>
        })}

      </div>
    )
  }
}