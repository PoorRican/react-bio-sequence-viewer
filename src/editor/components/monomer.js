import React from 'react'
import PropTypes from "prop-types";

import {
  colorize
} from "../helpers";
import {EditorContext} from "../data";

/**
 * Renders a single nucleotide
 * @param props.index {number} - index occurring in `EditorContext.sequence`
 * @param props.value {string} - Value to display. Should be single character, but may be set to string.
 * @param props.color {string} - Render color
 * @param props.highlighted {boolean} - Toggles styling for when component is highlighted
 */
export class Monomer extends React.PureComponent {
  static contextType = EditorContext;
  static defaultProps = {
    color: '',
    highlighted: false
  }

  // TODO: should a modifier key be used here?
  // TODO: handle drag
  updateCursor = (e) => {
    const index = Number(e.currentTarget.dataset.index);
    this.context.setCursor(index);
  }

  render() {
    return (
      <div className={[
             'nucleotide',
             this.props.highlighted ? colorize(this.context.highlighted.depth) : null,
             this.props.highlighted ? 'highlighted' : null,
            ].join(' ')}
           data-index={this.props.index}
           onClick={this.updateCursor}
      >
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