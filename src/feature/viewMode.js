import React from 'react'
import Xarrow from "react-xarrows";

import {
  isLinked,
  getItemId,
  getContainer,
  isSelected,
  linkedAnchors,
} from './helpers'
import {FeatureDialog} from "./featureDialog";
import {DataContext, MODES} from './data'
import {RearrangeableList} from "./rearrangeableList";


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
    const key = Number(getItemId(e.target));
    const container = getContainer(e.target)

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

    const [linked_starts, linked_ends] = linkedAnchors(this.context.items, this.context.linked);

    return(
      <div className={`feature-space`} hidden={this.context.mode === MODES.view}>

        <div className={'main ' + [
          this.context.mode,
        ].join(' ')}>

          <RearrangeableList id={`mainItems`}
            // state
                             active={false}
                             disabled={true}
            // data + handlers
                             data={this.context.items.mainItems}
                             itemHandlers={itemHandlers}
            // interaction states
                             selected={(this.context.selected.container === 'mainItems') ?
                               this.context.items.mainItems.map((item, index) => {
                                 return isSelected(this.context.selected, index)
                               }) : false}
                             linked={{
                               linked: this.context.items.mainItems.map((item, index) => {
                                 return isLinked(this.context.linked, index)
                               }),
                               starts: linked_starts,
                               ends: linked_ends,
                             }}
          />

          <Xarrow start="0" end={this.context.items.mainItems.length.toString()}
                  color={'purple'}
                  showHead={false}
                  startAnchor='left'
                  endAnchor='right'
                  curveness={0}
                  path={'straight'}
          />

        </div>{/* /.main */}

        <FeatureDialog
          isOpen={this.state.featureDialogOpen}
          data={this.context.selected.content}
          onClose={this.onDialogClose}
        />

      </div>
  )
  }

}