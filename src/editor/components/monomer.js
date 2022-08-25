import React from 'react'
import PropTypes from "prop-types";

import {
  colorize
} from "../helpers";
import {SequenceContext} from "../data";

/**
 * Renders a single nucleotide
 * @param props.index {number} - index occurring in `SequenceContext.sequence`
 * @param props.value {string} - Value to display. Should be single character, but may be set to string.
 * @param props.color {string} - Render color
 * @param props.highlighted {boolean} - Toggles styling for when component is highlighted
 */
export class Monomer extends React.PureComponent {
  static contextType = SequenceContext;
  static defaultProps = {
    color: '',
    highlighted: false
  }

  render() {
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

Monomer.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
  highlighted: PropTypes.bool,
}