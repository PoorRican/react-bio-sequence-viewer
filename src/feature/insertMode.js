import React from 'react'

import {H1} from "@blueprintjs/core";

import {
  isTarget,
  getItem,
  shiftLinked,
} from './helpers'
import {
  insert, features,
  DataContext,
} from './data'
import RearrangeableList from "./rearrangeableList";
import MainItems from "./mainItems";


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
    const [key, container] = getItem(target);

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
    if (isTarget(e.target)) {

      const selected = this.context.selected;
      const [key, container] = getItem(e.target);

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

    return(
      <div className={`feature-space`}>

        <MainItems active={this.state.activeDrags} disable={true}
                   context={this.context}
                   itemHandlers={itemHandlers} spacers={true} />

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