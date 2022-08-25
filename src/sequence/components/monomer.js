import React from 'react'

import {
  colorize
} from "../helpers";
import {SequenceContext} from "../data";

/**
 * Renders a single nucleotide
 * @param props.index {number} - index occurring in `SequenceContext.sequence`
 * @param props.value {string} - Single nucleotide character
 * @param props.color {string} - Render color
 * @param props.highlighted {boolean} - Toggles styling for when component is highlighted
 */
export class Monomer extends React.Component {
  static contextType = SequenceContext;

  render() {
    // remove this check if `Monomer` is rendering an amino acid using mnemonic
    if (typeof(this.props.value) !== 'string' || this.props.value.length !== 1) {
      Error('Incorrect value passed to Monomer component')
    }
    return (
      <div className={[
             'nucleotide',
             this.props.highlighted ? colorize(this.context.highlighted.depth) : null,
             this.props.highlighted ? 'highlighted' : null,
            ].join(' ')}>
        <span>
          {this.props.value}
        </span>
      </div>
    )
  }
}