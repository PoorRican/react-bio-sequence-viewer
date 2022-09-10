import React from 'react'
import PropTypes from "prop-types";

import {
  EditorContext,
} from "../data";
import {isPrimaryButton, withinBounds} from "../helpers";
import SequenceRowGroup from "./sequenceRowGroup";

import './sequenceText.css'
import {SegmentMenu} from "./segmentMenu";
import {CreateFeatureDialog} from "./createFeatureDialog";


/**
 * Main component to visualize and interact with monomer sequence, and it's feature hierarchy.
 *
 * @param props.width {number|undefined} - User-defined characters per row.
 * If undefined, it is automatically calculated based on screen width.
 *
 * @constructor
 */
export default class SequenceText extends React.Component {
  static contextType = EditorContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      /**
       * Control `CreateFeatureDialog`
       * @type {Boolean}
       */
      createDialogOpen: false,
    };
  }

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
                          features={this.context.hierarchy.within(start, end)}
        />
      )

    }
    return groups
  }

  /**
   * Handles resetting of `context.mode` when `MouseUpEvent` has not been handled by `Monomer.handleEndSelect`.
   * @see Monomer.handleEndSelect
   */
  resetMode = () => {
    if (this.context.mode === 'selecting') {
      this.context.setMode('view');
    }
  }

  /**
   * Nullify `this.context.cursor` when clicked outside of main text area.
   * @param e {MouseEvent}
   */
  clearSelected = (e) => {
    if (isPrimaryButton(e) && e.target.getAttribute('class') === 'wrapper')
      this.context.setCursor(null);
  }

  // Dialog Methods

  /**
   * Close dialog and nullify cursor.
   */
  onDialogClose = () => {
    this.setState({createDialogOpen: false});
    this.context.setCursor(null)
  }

  createFeature = () => {
    this.setState({createDialogOpen: true})
  }

  render() {
    const funcHandlers = {
      createFeature: this.createFeature,
    }

    return(

      <div className={'wrapper'}
           onMouseUp={this.resetMode}
           onMouseDownCapture={this.clearSelected}
      >

          <div className={[
            'sequence-text',
            this.context.highlighted ? 'highlighted' : null,
          ].join(' ')}>

            <SegmentMenu {...funcHandlers}>

              {this.sequenceGroups()}

            </SegmentMenu>

            <CreateFeatureDialog isOpen={this.state.createDialogOpen}
                                 onClose={this.onDialogClose} />

          </div>

      </div>
    )
  }
}

SequenceText.propTypes = {
  width: PropTypes.number.isRequired
}