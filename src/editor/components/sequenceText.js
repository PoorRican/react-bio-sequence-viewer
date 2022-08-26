import React from 'react'
import PropTypes from "prop-types";

import {
  SequenceContext,
} from "../data";
import {flattenHierarchy, withinBounds} from "../helpers";
import SequenceRowGroup from "./sequenceRowGroup";

import './sequenceText.css'


/**
 * Main component to visualize and interact with monomer sequence, and it's feature hierarchy.
 *
 * @param props.width {number|undefined} - User-defined characters per row.
 * If undefined, it is automatically calculated based on screen width.
 *
 * @constructor
 */
export default class SequenceText extends React.PureComponent {
  static contextType = SequenceContext;

  /**
   * Render styling helper for determining if *any* indices within given range is highlighted.
   *
   * @returns {boolean} - `true` if start or end of row is within highlighted region
   */
  isHighlighted = (start, end) => {
    if (!this.context.highlighted) return false
    return (
      withinBounds(start,
        this.context.highlighted.location) ||
      withinBounds(end,
        this.context.highlighted.location))
  }

  /**
   * Process fragments of `context.hierarchy` and `context.sequence` then generate an array of `SequenceRowGroup` components.
   *
   * @returns {SequenceRowGroup[]}
   */
  sequenceGroups = () => {
    // total number of rows
    const rows = Math.ceil(this.context.sequence.length / this.props.width);
    let groups = [];
    for (let i = 0; i < rows; i++) {
      const [start, end] = [i * this.props.width, (i + 1) * this.props.width];

      groups.push(
        <SequenceRowGroup key={start} start={start}
                          highlighted={this.isHighlighted(start, end)}
                          sequence={Array(...this.context.sequence).slice(start, end)}
                          features={flattenHierarchy(this.context.hierarchy, start, end)}
        />
      )

    }
    return groups
  }

  render() {
    return(
      <div className={[
              'sequence-text',
              this.context.highlighted ? 'highlighted' : null,
            ].join(' ')}
      >
        {this.sequenceGroups()}
      </div>
    )
  }
}

SequenceText.propTypes = {
  width: PropTypes.number.isRequired
}