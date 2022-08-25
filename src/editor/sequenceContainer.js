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

  render() {
    return <SequenceText />
  }
}