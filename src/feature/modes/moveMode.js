import React from 'react'

import {
  isTarget,
  getItem,
  shiftLinked,
} from '../helpers'
import {
  DataContext,
  move,
  link,
  unlink
} from '../data'
import MainItems from "../components/mainItems";


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

  /**
   * Calculates item count of linked group at `position`.
   *
   * @param position {[number, number]} - Indices of linked group
   *
   * @returns {number} - Number of items within `position`
   */
  count(position) {
    return position[1] - position[0] + 1;
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


      if (container !== selected.container) {     // rearranging should only occur within the same container
        alert("Incorrect feature origin or container target")
      }

      // manipulate items
      let items = this.context.items;
      items[container] = move(items[container], selected.content, [selected.index, index])

      // manipulate linked
      const single = typeof(selected.index) === 'number';
      if (single) {

        this.context.setLinked(shiftLinked(this.context.linked, index, -1, selected.index));

      } else {

        this.doLinkedShift(selected.index, index);

      }

      // update
      this.context.setItems(items)

    }
    this.context.unselect();
  };

  /**
   * Handles shifting of linked feature groups.
   *
   * @param from {[number, number]} - indices of linked group being moved
   * @param to {number} - index to move linked group to
   *
   */
  doLinkedShift(from, to) {
    const count = this.count(from);
    const upstream = from[0] > to;    // moving group upstream of original position

    /**
     * Prepare linked group to be shifted
     */
    let linked = unlink(this.context.linked, from);
    let magnitude;
    if (upstream) {
      magnitude = count - this.count([to, from[1]]);
    } else {
      magnitude = this.count([from[0], to]) - count - 1;
    }
    const updated = [from[0] + magnitude, from[1] + magnitude];

    /**
     * Determine linked groups that are affected: all groups in between `from` and `to`.
     */
    let between;
    if (upstream) {
      between = linked.filter((group) => {
        return group[0] > to && group[0] < from[0];
      });
    } else {
      between = linked.filter((group) => {
        return group[0] < to && group[0] > from[0];
      });
    }

    // shift affected linked groups by a magnitude of `count`
    between.forEach((group) => {
      linked = unlink(linked, group)
    });

    magnitude = upstream ? count : -count;
    between = between.map((group) => {
      return [group[0] + magnitude, group[1] + magnitude];
    });

    // re-link
    between.forEach((group) => {
      linked = link(linked, group);
    })
    linked = link(linked, updated);

    this.context.setLinked(linked);

  }

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
