import React from 'react'
import {
  Dialog,
  Classes,
  Button,
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import {Feature} from "../../types/feature"
import {EditorContext} from "../data";

/**
 * Handle user input for the creation of a feature based on selected sequence
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
   * Incorporate `context.cursor` and `this.state` to add `Feature` to `context.hierarchy`
   * TODO: this is where a mediator will be used.
   */
  addFeature = () => {
    const data = {
      id: this.state.id,
      location: this.context.cursor, // is this copied?
    }
    const parent = this.context.hierarchy.deepest(this.context.cursor[0], this.context.cursor[1]);

    const updated = this.context.hierarchy.add(new Feature(data), parent);
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
    // TODO: store property value as HTML dataset attribute
    this.setState({id: e.target.value})
  }

  render() {
    return(
      <Dialog isOpen={this.props.isOpen} title={"Create Feature / Annotate Sequence"}
              onClose={this.props.onClose}
              icon={`add-clip`}
      >

        <div className={Classes.DIALOG_BODY}>
          <input value={this.state.id} onChange={this.update}/>
        </div>

        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <Button onClick={this.cancel}
                    text={'Cancel'} />
            <Button onClick={this.addFeature}
                    text={'Create'}
                    intent={"primary"} />
          </div>
        </div>

      </Dialog>
    )
  }
}


CreateFeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
}
