import React from 'react'

import SequenceRow from "./sequenceRow";
import {
  SequenceContext,
} from "../data";
import FeatureBar from "./featureRowBar";
import {flattenHierarchy, withinBounds} from "../helpers";


/**
 * Renders wall of text representing nucleotide sequence and the components to view feature hierarchy
 *
 * @param props.data {[any]} - Nucleotide sequence to render
 * @param props.width {number|undefined} - User-defined characters per row. If undefined, width is automatically calculated.
 *
 * @constructor
 */
export default class SequenceText extends React.Component {
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
   * Render styling helper for determining if any content is highlighted
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

  render() {
    const rows = Math.ceil(this.props.data.length / this.state.width);
    let lines = [];
    for (let i = 0; i < rows; i++) {
      const [start, end] = [i * this.state.width, (i+1) * this.state.width];
      const data = this.props.data.slice(start, end);
      lines.push(
        <div key={i}
             className={[
               `sequence-row-group`,
               this.isHighlighted(start, end) ? 'highlighted' : null,
             ].join(' ')}
        >

          <SequenceRow row={i} data={data} width={this.state.width}/>

          <FeatureBar length={data.length}>
            {flattenHierarchy(this.context.hierarchy, start, end)}
          </FeatureBar>

        </div>
      )
    }

    return(
      <div className={[
              'sequence-text',
              this.context.highlighted ? (this.context.highlighted.id ? 'highlighted' : null) : null,
            ].join(' ')}
      >
        {lines}
      </div>
    )
  }
}