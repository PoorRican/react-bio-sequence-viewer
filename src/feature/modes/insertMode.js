import React from 'react'

import {H1} from "@blueprintjs/core";

import {
  isTarget,
  getItem,
  shiftLinked,
} from '../helpers'
import {
  insert, features,
  DataContext,
} from '../data'
import RearrangeableList from "../components/rearrangeableList";
import MainItems from "../components/mainItems";


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

  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    this.context.select(e.target);
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (isTarget(e.target)) {

      const selected = this.context.selected;
      const [index, container] = getItem(e.target);

      let items = this.context.items;
      items[container] = insert(items[container], selected.content, index);

      this.context.setLinked(shiftLinked(this.context.linked, index, 1));
      this.context.setItems(items);

    }
    // clear selected
    this.context.unselect();
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