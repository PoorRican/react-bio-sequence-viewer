import React from 'react'

import {
  isLinked,
  getItem,
} from './helpers'
import {DataContext} from './data'
import MainItems from "./mainItems";


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

    return(
      <div className={`feature-space`}>

        <MainItems active={false} disabled={true}
                   context={this.context}
                   itemHandlers={itemHandlers}/>

      </div>
    )
  }

}
