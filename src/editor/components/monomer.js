import React from 'react'
import PropTypes from "prop-types";

import {
  colorize
} from "../helpers";
import {EditorContext} from "../data";


function isPrimaryButton(event) {
  return event.buttons === 1
}

function getIndex(event) {
  return Number(event.currentTarget.dataset.index)
}


/**
 * Renders a single nucleotide
 * @param props.index {number} - index occurring in `EditorContext.sequence`
 * @param props.value {string} - Value to display. Should be single character, but may be set to string.
 * @param props.color {string} - Render color
 * @param props.highlighted {boolean} - Toggles styling for when component is highlighted
 */
export class Monomer extends React.PureComponent {
  static contextType = EditorContext;
  static defaultProps = {
    color: '',
    highlighted: false
  }

  /**
   * Updates `context.cursor` with `index` based on whichever coordinate is closer to index.
   * If `context.cursor` points to an index, then it is updated to an array.
   *
   * Used as visual feedback when updating cursor by dragging.
   *
   * @param index {number} - New index for `context.cursor` to point to
   *
   * @example
   * If `context.cursor = [50, 100]` and `index = 110`, then cursor is set to `[50, 110]`
   */
  updateCursor(index) {
    // this is true upon the MouseDown event
    if (typeof(this.context.cursor) === 'number') {
      this.context.setCursor([index, this.context.cursor].sort())
    }
    else {

      const distances = [
        Math.abs(index - this.context.cursor[0]),
        Math.abs(index - this.context.cursor[1])];

      if (distances[0] === Math.min(...distances)) {
        this.context.setCursor([index, this.context.cursor[1]])
      } else {
        this.context.setCursor([this.context.cursor[0], index])
      }

    }
  }

  /**
   * Sets `context.cursor` to current index. Gets called during `MouseDownEvent`.
   * @param e {MouseEvent}
   */
  // TODO: implement a modifier key be used here
  setCursor = (e) => {
    if (isPrimaryButton(e)) {
      const index = getIndex(e);
      this.context.setCursor(index);
    }
  }

  /**
   * Updates `context.cursor` when dragging.
   * @param e
   */
  handleDrag = (e) => {
    if (isPrimaryButton(e)) {
      this.context.setMode('selecting')
      this.updateCursor(getIndex(e));
    }
  }

  /**
   * Ends selection mode.
   *
   * In the event that mouse leaves area, `context.cursor` has already been updated by `this.handleDrag`
   * and `context.mode` reset is handled by `SequenceText.resetMode`
   *
   * @see SequenceText.resetMode
   * @see Monomer.handleDrag
   *
   * @param e {MouseEvent}
   */
  handleEndSelect = (e) => {
    if (this.context.mode === 'selecting') {
      this.updateCursor(getIndex(e))
      this.context.setMode('view')
    }
  }

  /**
   * Choose appropriate style derived from `SequenceRow.topLevelStyling`
   *
   * @param value {boolean|'start'|'end'|'single'} - `false` if not related to a top-level feature
   *
   * @returns {null|string} - value to pass to `className`
   *
   * @see SequenceRow.isTopLevelFeature
   */
  topLevelStyling(value) {
    switch (value) {
      case 'single': {
        return 'top-level start end'
      }
      case 'start': {
        return 'top-level start';
      }
      case 'end': {
        return 'top-level end';
      }
      case true: {
        return 'top-level'
      }
      default: {
        return null;
      }
    }
  }

  /**
   *
   * @param value {boolean|'start'|'end'|'single'} - `false` if not selected
   *
   * @returns {null|string} - value to pass to `className`
   *
   * @see SequenceRow.isSelected
   */
  selectedStyling(value) {
    switch (value) {
      case 'single': {
        return 'selected start end'
      }
      case 'start': {
        return 'selected start';
      }
      case 'end': {
        return 'selected end';
      }
      case true: {
        return 'selected'
      }
      default: {
        return null;
      }
    }
  }

render() {
    return (
      <div className={[
             'monomer',
             this.props.highlighted ? colorize(this.context.highlighted.depth) : null,
             this.props.highlighted ? 'highlighted' : null,
             this.topLevelStyling(this.props.topLevel),
             this.selectedStyling(this.props.selected),
            ].join(' ')}
           data-index={this.props.index}
           onMouseDown={this.setCursor}
           onMouseUp={this.handleEndSelect}
           onMouseEnter={this.handleDrag}
      >
        <span>
          {this.props.value}
        </span>
      </div>
    )
  }
}

Monomer.propTypes = {
  index: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  color: PropTypes.string,
  highlighted: PropTypes.bool,
}