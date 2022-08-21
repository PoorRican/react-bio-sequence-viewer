import React from 'react'

import {SequenceRow} from "./sequenceRow";


/**
 * Renders wall of text representing nucleotide sequence and the components to view feature hierarchy
 *
 * @param props.data {[any]} - Nucleotide sequence to render
 * @param props.width {number|undefined} - User-defined characters per row. If undefined, width is automatically calculated.
 *
 * @constructor
 */
export class SequenceText extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      width: props.width ? props.width : this.determineWidth()
    }
  }

  /**
   * Function to determine comfortable width to render sequence
   * @returns {number}
   */
  determineWidth() {
    return 21;
  }

  render() {
    const rows = Math.ceil(this.props.data.length / this.state.width);
    let lines = [];
    for (let i = 0; i < rows; i++) {
      const [start, end] = [i * this.state.width, (i+1) * this.state.width];
      const data = this.props.data.slice(start, end);
      lines.push(<SequenceRow row={i} data={data} key={i}/>)
    }

    return(
      <div className={'sequence-text'}>
        {lines}
      </div>
    )
  }
}