import React from 'react'

import {
  getItem,
} from './helpers'
import {FeatureDialog} from "./featureDialog";
import {DataContext} from './data'
import MainItems from "./mainItems";


export default class ViewMode extends React.Component {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      featureDialogOpen: false,
    }
  }

  // handler functions
  onClick = (e) => {
    const [key, container] = getItem(e.target);

    this.context.setSelected({
      key: key,
      container: container,
      content: this.context.items[container][key],
    });

    this.setState({featureDialogOpen: true})
  }

  onDialogClose = () => {
    this.setState({featureDialogOpen: false});
    this.context.setSelected({key: null, container: null, content: null});
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