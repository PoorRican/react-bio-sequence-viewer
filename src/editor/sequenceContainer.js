import React from 'react'

import {SequenceContext} from './data'
import SequenceText from "./components/sequenceText";

import './sequenceView.css'


/**
 * Top-level container for rendering any menus or other content that will be persistent for all modes
 * (ie: context menu, mode changing menu, scrollbar, etc.) as well as the primary `SequenceText` object.
 */
export default class SequenceContainer extends React.Component {
  static contextType = SequenceContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      width: this.determineWidth()
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

  render() {
    return <SequenceText width={this.state.width}/>
  }
}