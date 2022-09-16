import React from 'react'
import PropTypes from 'prop-types'

import {withinBounds} from "../helpers";
import {EditorContext} from "../data";
import {Monomer} from "./monomer";



/**
 * Renders a single row of `Monomer` values
 *
 * @param props.sequence {[string]} - Segment of `context.sequence`
 * @param props.start {number} - First index of row
 * @param props.topLevel {[]} - Top-level features. Handled by `SequenceRow.isTopLevelFeature`
 */
export class SequenceRow extends React.PureComponent {
  static contextType = EditorContext;

  /**
   * Handle styling of index segments.
   *
   * @param index {number} - index to evaluate
   * @param range {[number, number]} -  given range
   *
   * @returns {'single'|'start'|'end'|boolean} - 'single' if 1-mer; 'start'/'end' if `index` is endpoint;
   * `true` if inside of range, otherwise `false`
   */
  handleRangeStyling(index, range) {
    /**
     * Pre-compute boolean values to handle 1-mer `Feature`
     */
    const start = index === range[0];
    const end = index === range[1] ||       // handle if `end` === sequence width
      (range[1] === this.props.start + this.props.sequence.length && index === range[1]-1)

    if (start && end) {
      return 'single'
    } else if (start) {
      return `start`;
    } else if (end) {
      return 'end';
    } else if (withinBounds(index, range)) {
      return true;
    }
    return false;
  }

  /**
   * Check if `index` is endpoint, or inside a top-level feature.
   *
   * @param index {number} - Index of monomer in question
   *
   * @returns {boolean|'start'|'end'|'single'} - `false` if `index` is unrelated to top-level feature;
   * otherwise returns value of `handleRangeStyling`
   *
   * @see Monomer.topLevelStyling
   * @see handleRangeStyling
   */
  isTopLevelFeature(index) {
    if (this.props.topLevel && this.props.topLevel.length) {

      for (const feature of this.props.topLevel) {

        const value = this.handleRangeStyling(index, feature.global_location);
        if (value) return value;

      }
    }

    return false;
  }

  /**
   * Check if given index is within the cursor selection.
   *
   * @param index {number|[number, number]}
   *
   * @returns {boolean} - `false` if `index` is `this.context.cursor`; otherwise returns value of `handleRangeStyling`
   * @see handleRangeStyling
 */
  isSelected(index) {
    if (this.context.cursor !== null) {
      if (typeof this.context.cursor === 'number') {
        return this.handleRangeStyling(index, [this.context.cursor, this.context.cursor]);
      } else {
        return this.handleRangeStyling(index, this.context.cursor);
      }
    }
  }

  render() {
    return (
      <div className={[
        'sequence-row',
      ].join(' ')}>

        {this.props.sequence.map((value, column) => {
          let index = this.props.start + column;
          return <Monomer index={index}
                          key={index}
                          value={value}
                          topLevel={this.isTopLevelFeature(index)}
                          selected={this.isSelected(index)}
                          highlighted={this.context.highlighted ? withinBounds(index,
                            this.context.highlighted.location) : false}
          />
        })}

      </div>
    )
  }
}

SequenceRow.propTypes = {
  sequence: PropTypes.array.isRequired,
  start: PropTypes.number.isRequired,
  topLevel: PropTypes.array,
}