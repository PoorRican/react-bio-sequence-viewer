import React from 'react'

import {
  isTarget,
  getItem,
  shiftLinked,
} from './helpers'
import {
  DataContext,
  move,
  link,
  unlink
} from './data'
import MainItems from "./mainItems";


/**
 * Allows moving and rearranging of individual and linked `FeatureItem` components via a drag-and-drop interface.
 */
export default class MoveMode extends React.Component {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeDrags: false,
    }
  }

  // handler functions
  /**
   * Selects `context.selected` based on `e`
   *
   * @param e {MouseEvent}
   */
  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    this.context.select(e.target);
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (isTarget(e.target)) {

      const selected = this.context.selected;
      const [index, container] = getItem(e.target)

      // manipulate items
      let items = this.context.items;
      items[container] = move(items[container], selected.content, [selected.index, index])

      // manipulate linked
      const single = typeof(selected.index) === 'number'
      const magnitude = single ? 1 : index - selected.index[1] - 1

      let linked;
      if (single) {
        linked = shiftLinked(this.context.linked, index, -magnitude, selected.index);
      } else {
        linked = unlink(this.context.linked, selected.index);
        linked = shiftLinked(linked, index, -magnitude, selected.index[0]);
        linked = link(linked, [selected.index[0] + magnitude, selected.index[1] + magnitude]);
      }

      // update
      this.context.setLinked(linked);
      this.context.setItems(items.mainItems)

    }
    this.context.unselect();
  };


  render() {
    const itemHandlers = {
      onStart: this.onStart,
      onStop: this.onDrop,
    }

    return(
      <div className={`feature-space`}>

        <MainItems active={this.state.activeDrags} disabled={false}
                   context={this.context}
                   itemHandlers={itemHandlers} spacers={true}/>

      </div>
    )
  }

}
