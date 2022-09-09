import React from 'react'
import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";

import {EditorContext} from '../data'
import {withinBounds} from "../helpers";


/**
 * Recursively extrapolate index of `target`.
 *
 * @param target {ParentNode|HTMLElement}
 *
 * @returns {number|null} - Index of target
 */
function getIndex(target) {
  try {
    if (target.hasAttribute('data-index')) {
      return Number(target.dataset.index);
    } else
      return getIndex(target.parentNode);
  }
  catch (e) {
    return null;
  }
}


export class SegmentMenu extends React.Component {
  static contextType = EditorContext;

  constructor(props, context) {
    super(props, context);

    this.state = {
      disabled: false,
      onSequence: false,
    }
  }

  insert = (e) => {

  }

  delete = (e) => {
    let range = this.context.cursor;
    if (range.hasOwnProperty('features')) {
      range = range.location;
    }
    // TODO: change selected feature range
    this.context.setSequence(this.context.sequence.delete(range));
    this.context.setCursor(null);
  }

  swap = (e) => {}

  replace = (e) => {}

  /**
   * Interpret user intent for `Sequence` manipulation functions.
   *
   * Sets internal state before rendering menu, to disable menu elements
   *
   * @param e {MouseEvent}
   *
   * @see Sequence
   */
  checkIntent = (e) => {
    const index = getIndex(e.target);

    // MouseEvent occurred outside of cursor
    if ( (typeof this.context.cursor === 'number' && index !== this.context.cursor) || !withinBounds(index, this.context.cursor)) {
      this.context.setCursor(index);
    }

    // MouseEvent did not occur on an index and cursor is not set
    if (index === null || this.context.cursor === null) {
      this.setState({onSequence: true});
    } else
      this.setState({onSequence: false});

  }


  render() {
    return (
      <ContextMenu2
        onContextMenu={this.checkIntent}
        content={
        <Menu>
          <MenuItem2 text={'Create Feature'}
                     disabled={this.state.onSequence} />
          <MenuItem2 text={'Modify Selection'}
                     disabled={this.state.onSequence}>
            <MenuItem2 text={'Insert'}  onClick={this.insert} />
            <MenuItem2 text={'Delete'}  onClick={this.delete} />
            <MenuItem2 text={'Swap'}    onClick={this.swap} />
            <MenuItem2 text={'Replace'} onClick={this.replace} />
          </MenuItem2>
        </Menu>
      } >
        {this.props.children}
      </ContextMenu2>
    )
  }
}