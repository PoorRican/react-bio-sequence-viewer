import React from 'react'

import {
  SequenceContext,
} from "../data";
import {flattenHierarchy, withinBounds} from "../helpers";
import SequenceRowGroup from "./sequenceRowGroup";


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

  constructor(props, context) {
    super(props, context)

    this.state = {
      width: props.width ? props.width : this.determineWidth(),
    }
  }

  /**
   * Function to determine comfortable width to render sequence
   * TODO: actually implement this function
   * @returns {number}
   */
  determineWidth() {
    return 42;
  }

  /**
   * Render styling helper for determining if any content is highlighted.
   *
   * @returns {boolean} - `true` if start or end of row is within highlighted region
   */
  isHighlighted(start, end) {
    if (!this.context.highlighted) return false
    return (
      withinBounds(start,
        this.context.highlighted.location) ||
      withinBounds(end,
        this.context.highlighted.location))
  }

  /**
   * Computes sections of `context.hierarchy` and `context.sequence` then generates an array of `SequenceRowGroup` components
   *
   * @returns {SequenceRowGroup[]}
   */
  sequenceGroups() {
    // total number of rows
    const rows = Math.ceil(this.context.sequence.length / this.state.width);
    let groups = [];
    for (let i = 0; i < rows; i++) {
      const [start, end] = [i * this.state.width, (i + 1) * this.state.width];

      groups.push(
        <SequenceRowGroup key={start} start={start}
                          highlighted={this.isHighlighted(start, end)}
                          sequence={this.context.sequence.slice(start, end)}
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
              this.context.highlighted ? (this.context.highlighted.id ? 'highlighted' : null) : null,
            ].join(' ')}
      >
        {this.sequenceGroups()}
      </div>
    )
  }
}