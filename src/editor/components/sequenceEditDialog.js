import React from 'react'
import {
  Dialog,
  Classes,
  Button,
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import {EditorContext} from "../data";

/**
 * Handle user input for the creation of a feature based on selected sequence
 */
export class SequenceEditDialog extends React.Component {
  static contextType = EditorContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      sequence: '',
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
   * Update `this.context.sequence` based on user-input
   *
   * @see Sequence.insert
   */
  insertSequence = () => {
    const index = (typeof this.context.cursor === 'number') ? this.context.cursor : this.context.cursor[0];
    const updated = this.context.sequence.insert(this.state.sequence, index);

    if (this.#validateSequence()) {
      this.context.setSequence(updated);
      this.props.onClose(false);
    }
  }

  /**
   * Replace segment in `this.context.sequence` based on user-input
   *
   * @see Sequence.swap
   */
  replaceSequence = () => {
    const updated = this.context.sequence.swap(this.state.sequence, this.context.cursor);

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
    this.setState({sequence: e.target.value})
  }

  render() {
    return(
      <Dialog isOpen={this.props.isOpen}
              title={(this.#inInsertMode() ? "Insert" : "Replace") +" Sequence"}
              onClose={this.props.onClose}
              onOpening={this.setSequence}
              icon={`add-to-artifact`} >

        <div className={Classes.DIALOG_BODY}>
          <input value={this.state.sequence} onChange={this.update}/>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.cancel}
                    text={'Cancel'} />
            <Button onClick={this.#inInsertMode() ? this.insertSequence : this.replaceSequence}
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
