import React from 'react'

import {withinBounds} from "../helpers";
import {SequenceContext} from "../data";
import {Monomer} from "./monomer";


/**
 * Renders a single row of `Monomer` values
 *
 * @param props.sequence {[string]} - Segment of `context.sequence`
 * @param props.start {number} - First index of row
 *
 * @returns {JSX.Element}
 *
 * @constructor
 */
export default class SequenceRow extends React.PureComponent {
  static contextType = SequenceContext;

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
                          highlighted={this.context.highlighted ? withinBounds(index,
                               this.context.highlighted.location) : false}/>
        })}

      </div>
    )
  }
}