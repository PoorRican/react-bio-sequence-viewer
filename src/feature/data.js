import React, {createContext} from 'react'

import {getItem, isLinked} from "./helpers";
import {generateFeatures} from "./feature";
import {MODES} from "./modeMenu";

export const features = generateFeatures(30);
export const DataContext = createContext({
    mode: '',
    items: {
      mainItems: {},
    },
    linked: [],
    selected: {
      index: null,
      container: null,
      content: null,
    },
    setItems: () => {},
    setLinked: () => {},
    select: () => {},
    unselect: () => {},
  }
);

export function insert(list, item, position) {
  const s1 = list.slice(0, position).concat([item]);
  const s2 = list.slice(position);
  return s1.concat(s2)
}

/**
 * @description Moves items within a given list
 *
 * @param {[]} list - list to manipulate.
 * @param {*|[]} item - item to insert. Could be an array or single object.
 * @param {[number, number]|[[], number]} positions - always arranged [from position, to position].
 * Function is capable of moving items from lower or higher indices.
 *
 * @returns manipulated copy of `list`
 */
export function move(list, item, positions) {
  /** If both items in `position` are the same, the list is not manipulated, but just returned. */
  if (positions[0] === positions[1]) {
    return list;
  }

  item = item.length ? item : [item]                  // encapsulate item if it is a single object

  const single = typeof(positions[0]) === 'number'                              // determines if only a single item will be moved
  const size = single ? 1 : positions[0][1] - positions[0][0] + 1               // size of gap to create
  const reverse = (single ? positions[0] : positions[0][0]) > positions[1]      // moving from or to higher index
                                                                                // `true` if moving to lower index

  const lo = (!reverse) ? (single ? positions[0] : positions[0][0]) : positions[1]
  const hi = reverse ? (single ? positions[0] : positions[0][0]) : positions[1]

  const s1 = list.slice(0, lo)
  let s2, s3;
  if (reverse) {
    // moving to lower index
    s2 = item.concat(list.slice(lo, hi))
    s3 = list.slice(hi+size)
  } else {
    // moving to higher index
    s2 = list.slice(lo+size, hi).concat(item)
    s3 = list.slice(hi)
  }
  return s1.concat(s2).concat(s3)
}

export function _delete(list, position) {
  if (typeof(position) === 'number') {
    const s1 = list.slice(0, position);
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  } else {
    const s1 = list.slice(0, position[0]);
    const s2 = list.slice(position[1] + 1);
    return s1.concat(s2)
  }
}

export function link(list, positions) {
  for (let i = 0; i < positions.length; i++) {
    if (isLinked(list, positions[i])) {
      // leave linked items intact
      // TODO: show an error as toast
      console.info('already linked')
      return list;
    }
  }

  console.info('linked ' + positions)
  return list.concat([positions])
}

export function unlink(list, positions) {
  for (let i = 0; i < list.length; i++) {
    if (positions[0] === list[i][0] &&
      positions[1] === list[i][1]) {
      list.splice(i, 1);
      return list
    }
  }
}

const defaultData = {
  mode: MODES.view,
  items: {
    mainItems: features.slice(0, 15),
  },
  linked: [],
  selected: {
    index: null,
    container: null,
    content: null,
  },
}

export default class Provider extends React.Component {
  constructor(props) {
    super(props);

    this.setMode = (mode) => {
      this.setState({
        mode: mode
      })
    }
    this.setItems = (items) => {
      this.setState({
        items: items
      })
    }
    this.setLinked = (linked) => {
      this.setState({
        linked: linked,
      })
    }

    /**
     * Used by `MouseEvent` callbacks to select `FeatureItem` components in _all_ modes.
     *
     * Upon `MouseClickDown`, the targeted `FeatureItem` component, and it's index is stored in `this.state.selected`.
     * When a group of linked `FeatureItem` components (or when selecting during `SelectMode`) has been selected,
     * the selected
     *
     * @param target {HTMLElement} - `FeatureItem` (as `HTMLElement`) which is the target of `MouseEvent`
     * @param [selecting=false] {boolean} - Used by `SelectMode` to indicate that a selection of multiple features has begun
     */
    this.select = (target, selecting=false) => {
      const [index, container] = getItem(target);
      const linked = isLinked(this.state.linked, index)     // index + 1 if linked

      if (selecting) {
        const prev_sel_index = this.state.selected.index
        let sorted;

        // occurs when a linked item is selected
        if (container === 'mainItems' && (linked || typeof(prev_sel_index ) !== 'number')) {
          if (linked) {
            // linked item is selected last
            const indices = this.state.linked[linked-1];
            sorted = [prev_sel_index , indices[0], indices[1]].sort();
          } else {
            // linked item is selected first
            sorted = [prev_sel_index[0], prev_sel_index[1], index].sort()
          }
          sorted.splice(1,1)

        } else {

          sorted = [prev_sel_index, index].sort()

        }

        this.setState({
          selected: {
            index:      sorted,
            container:  container,
            content:    this.state.items.mainItems.slice(sorted[0], sorted[1]+1),
          }
        })

      } else {                        // this runs first

        if (container === 'mainItems' && linked) {

          const indices = this.state.linked[linked-1];

          this.setState({
            selected: {
              index:      indices,
              container:  container,
              content:    this.state.items.mainItems.slice(indices[0], indices[1]+1)
            }
          })

        } else {

          this.setState({
            selected: {
              index:      index,
              container:  container,
              content:    this.state.items[container][index],
            }
          });
        }
      }
    }
    this.unselect = () => {
      this.setState({
        selected: {
          index: null,
          container: null,
          content: null
        }
      })
    }

    this.state = {
      // data
      mode: defaultData.mode,
      items: {
        mainItems: defaultData.items.mainItems,
      },
      linked: defaultData.linked,
      selected: defaultData.selected,

      // setters
      setMode: this.setMode,
      setItems: this.setItems,
      setLinked: this.setLinked,
      select: this.select,
      unselect: this.unselect,
    }
  }
  render() {
    return (
      <DataContext.Provider value={this.state}>
        {this.props.children}
      </DataContext.Provider>
    )
  }
}
