import React from 'react'
import PropTypes from "prop-types";

import {FeatureForm} from "../../components/featureForm";
import {FeatureDialog} from "../../components/featureDialog";
import {EditorContext} from "../data";


/**
 * Composes `FeatureDialog` and `FeatureForm` to handle user input and create `Feature` using `cursor` position.
 *
 * TODO: create an intermediate HOC `FeatureDialogForm` that reduces boilerplate for editing functionality.
 *
 * @see FeatureForm
 * @see FeatureDialog
 */
export class EditFeatureDialog extends React.Component {
  static contextType = EditorContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      id: '',
    }
  }

  /**
   * Update `Feature` attributes in `context.hierarchy` using values from `state`
   */
  updateFeature = () => {
    const updated = this.context.hierarchy.edit(this.context.cursor.accessor, {...this.state});
    this.context.setHierarchy(updated);

    this.cancel();
  }

  /**
   * Initialize state to values from `cursor`
   */
  initialize = () => {
    let initial = {};
    for (let key of Object.keys(this.state)) {
      initial[key] = this.context.cursor[key];
    }
    this.setState(initial);
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

  render() {
    const footer = [
      {
        onClick: this.cancel,
        text: 'Cancel'
      },
      {
        onClick: this.updateFeature,
        text: 'Update',
        intent: "primary"
      }
    ]
    return(
      <FeatureDialog isOpen={this.props.isOpen}
                     title={"Edit / Update Feature"}
                     onClose={this.props.onClose}
                     icon={`annotation`}
                     onOpening={this.initialize}
                     footer={footer} >

        <FeatureForm update={this.update}
                     id={this.state.id} />

      </FeatureDialog>
    )
  }
}


EditFeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
