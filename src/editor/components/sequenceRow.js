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
export default class SequenceRow extends React.PureComponent {
  static contextType = EditorContext;

  /**
   * Check if `index` is endpoint, or inside a top-level feature.
   *
   * @param index {number} - Index of monomer in question
   *
   * @returns {boolean|'start'|'end'} - false if not related to 'top-level feature';
   * 'start' / 'end' for corresponding endpoints; `true` if inside feature.
   *
   * @see Monomer.topLevelStyling
   */
  isTopLevelFeature(index) {
    if (this.props.topLevel && this.props.topLevel.length) {

      for (const feature of this.props.topLevel) {

        const loc = feature.global_location;

        /**
         * Pre-compute boolean values to handle 1-mer `Feature`
         */
        const start = index === loc[0];
        const end = index === loc[1] ||       // handle if `end` === sequence width
          (loc[1] === this.props.start + this.props.sequence.length && index === loc[1]-1)

        if (start && end) {
          return 'single'
        } else if (start) {
          return `start`;
        } else if (end) {
          return 'end';
        } else if (withinBounds(index, loc)) {
          return true;
        }

      }
    }

    return false;
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