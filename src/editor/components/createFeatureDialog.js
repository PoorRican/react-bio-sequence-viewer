import React from 'react'
import PropTypes from "prop-types";

import {FeatureForm} from "../../components/featureForm";
import {FeatureDialog} from "../../components/featureDialog";
import {RenderFeature} from "../../types/renderFeature"
import {EditorContext} from "../data";


/**
 * Composes `FeatureDialog` and `FeatureForm` to handle user input and create `Feature` using `cursor` position.
 *
 * TODO: create an intermediate HOC `FeatureDialogForm` that reduces boilerplate for editing functionality.
 *
 * @see FeatureForm
 * @see FeatureDialog
 */
export class CreateFeatureDialog extends React.Component {
  static contextType = EditorContext

  constructor(props, context) {
    super(props, context);

    this.state = {
      id: '',
    }
  }

  /**
   * Incorporate `context.cursor` and `this.state` to add `RenderFeature` to `context.hierarchy`
   */
  addFeature = () => {
    const data = {
      id: this.state.id,
      location: this.context.cursor, // is this copied?
    }
    /**
     * Only use first index, since `addFeature` should only be called when fully enclosed by a `RenderFeature`
     *
     * @type {RenderFeature|false}
     */
    const parent = this.context.hierarchy.deepestAt(this.context.cursor[0]);
    const updated = this.context.hierarchy.add(new RenderFeature(data), parent.accessor);
    this.context.setHierarchy(updated);

    this.cancel();
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
        onClick: this.addFeature,
        text: 'Create',
        intent: "primary"
      }
    ]
    return(
      <FeatureDialog isOpen={this.props.isOpen}
                     title={"Create Feature / Annotate Sequence"}
                     onClose={this.props.onClose}
                     icon={`add-clip`}
                     footer={footer} >

        <FeatureForm update={this.update}
                     id={this.state.id} />

      </FeatureDialog>
    )
  }
}


CreateFeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
