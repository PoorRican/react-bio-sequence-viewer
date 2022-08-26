import React from 'react'

import {FeatureDialog} from "../components/featureDialog";
import {FeatureContext} from '../data'
import MainItems from "../components/mainItems";


export default class ViewMode extends React.Component {
  static contextType = FeatureContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      featureDialogOpen: false,
    }
  }

  // handler functions
  onClick = (e) => {
    this.context.select(e.target);

    this.setState({featureDialogOpen: true});
  }

  onDialogClose = () => {
    this.setState({featureDialogOpen: false});
    this.context.unselect();
  }

  render() {
    const itemHandlers = {
      onClick: this.onClick
    }

    return(
      <div className={`feature-space`}>

        <MainItems active={false} disabled={true}
                   context={this.context}
                   itemHandlers={itemHandlers} />

        <FeatureDialog
          isOpen={this.state.featureDialogOpen}
          data={this.context.selected.content}
          onClose={this.onDialogClose}
        />

      </div>
  )
  }

}