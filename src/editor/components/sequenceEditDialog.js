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
   * Update `this.context.Sequence` based on user-input
   *
   * @see Sequence.insert
   */
  insertSequence = () => {
    const index = (typeof this.context.cursor === 'number') ? this.context.cursor : this.context.cursor[0];
    const updated = this.context.sequence.insert(this.state.sequence, index);

    this.context.setSequence(updated);
    this.props.onClose(false);
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
      <Dialog isOpen={this.props.isOpen} title={"Insert Sequence"}
              onClose={this.props.onClose}
              icon={`add-to-artifact`} >

        <div className={Classes.DIALOG_BODY}>
          <input value={this.state.sequence} onChange={this.update}/>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.cancel}
                    text={'Cancel'} />
            <Button onClick={this.insertSequence}
                    text={'Insert'}
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
