import React from 'react'
import {
  Dialog,
  Classes,
  Button,
  Checkbox,
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import {EditorContext} from "../data";

/**
 * Parse cursor location
 * @param location {number|[number, number]|RenderFeature}
 * @returns {number|*}
 */
function extractCursorLocation(location) {
 if (typeof location === 'number') {
   return location;
 }
 else if (location.hasOwnProperty('features')) {
   return location.location;
 } else {
   return location
 }
}

/**
 * Handle user input for the creation of a feature based on selected sequence
 */
export class SequenceEditDialog extends React.Component {
  static contextType = EditorContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      sequence: '',

      append: false,
    }
  }

  /**
   * Get segment content pointed to by `cursor`
   *
   * @returns {String} - content pointed to by `cursor`
   */
  #getSegment() {
    if (this.context.cursor) {
      const [start, end] = this.context.cursor;
      return this.context.sequence.slice(start, end+1).join('');
    }
    return '';
  }

  /**
   * Lifecycle function that sets or clears `this.state.sequence` based on mode.
   */
  setSequence = () => {
    this.#inInsertMode() ? this.setState({sequence: ''}) : this.setState({sequence: this.#getSegment()})
  }

  setupDialog = () => {
    this.setSequence();
    this.setState({append: this.#isLastEndPoint()});
  }

  #inInsertMode() {
    return this.context.mode === 'insert'
  }

  /**
   * Validate that user-input is valid sequence.
   *
   * @returns {boolean}
   */
  #validateSequence() {
    return true;
  }

  /**
   * Determines if single selected monomer intersects last feature endpoint.
   * @returns {boolean} - `true` if last endpoint matches; otherwise `false`
   */
  #isLastEndPoint() {
    const range = (typeof this.context.cursor === 'number') ? [this.context.cursor, this.context.cursor] :
      (this.context.cursor.hasOwnProperty('features') ? this.context.cursor.location : this.context.cursor)
    const accessor = this.context.hierarchy.deepest(range[0], range[1], false);
    const feature = this.context.hierarchy.retrieve(accessor);

    const loc = feature.location;
    return loc[1] === range[1];
  }

  /**
   * Update `this.context.sequence` based on user-input
   *
   * @see Sequence.insert
   */
  insertSequence = () => {
    const range = extractCursorLocation(this.context.cursor);
    const index = typeof range === 'number' ? range : this.state.append ? range[1] : range[0];

    if (this.#validateSequence()) {
      const updated = this.context.sequence.insert(this.state.sequence, index, this.state.append);
      this.context.mediator().resize(this.state.sequence.length, index);

      this.context.setSequence(updated);
      this.props.onClose(false);
    }
  }

  /**
   * Replace segment in `this.context.sequence` based on user-input
   *
   * @see Sequence.replaceSegment
   */
  replaceSegment = () => {
    const updated = this.context.sequence.replaceSegment(this.state.sequence, this.context.cursor);

    if (this.#validateSequence()) {
      // update cursor length
      if (typeof this.context.cursor !== 'number' && !this.context.cursor['location']) {
        const cursor = [this.context.cursor[0], this.state.sequence.length - 1 + this.context.cursor[0]];
        this.context.setCursor(cursor);
      }

      this.context.setSequence(updated);
      this.props.onClose(false)
    }
  }

  /**
   * Clear state and close dialog
   */
  cancel = () => {
    this.setState({id: ''});
    this.props.onClose();
  }

  update = (e) => {
    let update = {};
    update[e.currentTarget.dataset.attribute] = e.target.value;

    this.setState(update)
  }

  toggleAppend = () => {
    this.setState({append: !this.state.append});
  }

  render() {
    return(
      <Dialog isOpen={this.props.isOpen}
              title={(this.#inInsertMode() ? "Insert" : "Replace") +" Sequence"}
              onClose={this.props.onClose}
              onOpening={this.setupDialog}
              icon={`add-to-artifact`} >

        <div className={Classes.DIALOG_BODY}>

          <input data-attribute={'sequence'}
                 value={this.state.sequence}
                 onChange={this.update} />

          <Checkbox label={"Append Segment"}
                    checked={this.state.append}
                    onChange={this.toggleAppend} />
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.cancel}
                    text={'Cancel'} />
            <Button onClick={this.#inInsertMode() ? this.insertSequence : this.replaceSegment}
                    text={this.#inInsertMode() ? 'Insert' : 'Replace'}
                    intent={"primary"} />
          </div>
        </div>

      </Dialog>
    )
  }
}


SequenceEditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
