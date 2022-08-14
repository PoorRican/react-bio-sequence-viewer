import React from 'react'
import Xarrow from "react-xarrows";

import {
  isLinked, isSelected,
  getItem,
  linkedAnchors,
} from './helpers'
import {DataContext} from './data'
import {RearrangeableList} from "./rearrangeableList";


export default class SelectMode extends React.Component {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      selecting: false,
    }
  }

  // handler functions
  onClick = (e) => {
    this.select(e.target);
  }

  select(target, toggle=true) {
    const [key, container] = getItem(target);
    const linked = isLinked(this.context.linked, key)     // index + 1 if linked

    if (this.state.selecting) {
      const prev_sel_key = this.context.selected.key
      let sorted;

      // occurs when a linked item is selected
      if (container === 'mainItems' && (linked || typeof(prev_sel_key) !== 'number')) {
        if (linked) {
          // linked item is selected last
          const keys = this.context.linked[linked-1];
          sorted = [prev_sel_key, keys[0], keys[1]].sort();
        } else {
          // linked item is selected first
          sorted = [prev_sel_key[0], prev_sel_key[1], key].sort()
        }
        sorted.splice(1,1)

      } else {

        sorted = [prev_sel_key, key].sort()

      }

      this.context.setSelected({
        key:        sorted,
        container:  container,
        content:    this.context.items.mainItems.slice(sorted[0], sorted[1]+1),
      })

    } else {                        // this runs first

      if (container === 'mainItems' && linked) {

        const keys = this.context.linked[linked-1];

        this.context.setSelected({
          key: keys,
          container: container,
          content: this.context.items.mainItems.slice(keys[0], keys[1]+1)
        })

      } else {

        this.context.setSelected({
          key: key,
          container: container,
          content: this.context.items[container][key],
        });
      }
    }

    if (toggle) {
      this.setState({selecting: !this.state.selecting});
    }
  }

  render() {
    const itemHandlers = {
      onClick: this.onClick
    }

    const [linked_starts, linked_ends] = linkedAnchors(this.context.items, this.context.linked);

    return(
      <div className={`feature-space`}>

        <div className={'main ' + this.context.mode}>

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

      </div>
    )
  }

}
