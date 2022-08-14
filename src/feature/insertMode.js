import React from 'react'
import Xarrow from "react-xarrows";

import {
  isLinked,
  getItemId,
  getContainer,
  isSelected,
  linkedAnchors,
  shiftLinked,
} from './helpers'
import {insert} from './data'
import {DataContext, features} from './data'
import {RearrangeableList} from "./rearrangeableList";
import {H1} from "@blueprintjs/core";

const availableContainerId = "availableItems"

export default class InsertMode extends React.Component {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);

    let availableItems = props.availableItems;
    if (availableItems === undefined) {
      availableItems = features.slice(15, 30);
    }

    this.state = {
      activeDrags: 0,
      availableItems: availableItems,
    }
  }


  select(target) {
    const key = Number(getItemId(target));
    const container = getContainer(target)

    if (container === availableContainerId) {
      this.context.setSelected({
        key:        key,
        container:  container,
        content:    this.state[container][key],
      })
    }
  }


  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    this.select(e.target);
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {

      const selected = this.context.selected;
      const key = Number(getItemId(e.target));
      const container = getContainer(e.target);

      let items = this.context.items;
      items[container] = insert(items[container], selected.content, key);

      this.context.setLinked(shiftLinked(this.context.linked, key, 1));
      this.context.setItems(items.mainItems);

    }
    // clear selected
    this.context.setSelected({key: null, container: null, content: null});
  };

  render() {
    const itemHandlers = {
      onStart: this.onStart,
      onStop: this.onDrop,
    };
    const spacerHandlers = {};

    const [linked_starts, linked_ends] = linkedAnchors(this.context.items.mainItems, this.context.linked);

    return(
      <div className={`feature-space`}>

        <div className={'main ' + [
          'expanded',
          this.context.mode,
        ].join(' ')}>

          <RearrangeableList id={`mainItems`}
            // state
                             active={this.state.activeDrags}
                             disabled={true}
            // data + handlers
                             data={this.context.items.mainItems}
                             itemHandlers={itemHandlers}
                             spacerHandlers={spacerHandlers}
            // interaction states
                             selected={(this.context.selected.container === 'mainItems') ?
                               this.context.items.mainItems.map((item, index) => {
                                 return isSelected(this.context.selected, index)}) : false}
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

        <div className={`selection bp4-elevation-2 ` + this.context.mode}>
          <H1>Available Items:</H1>
          <RearrangeableList id={availableContainerId}
                             data={this.state.availableItems}
                             itemHandlers={itemHandlers}
          />
        </div>{/* /.section */}
      </div>
    )
  }

}