import React from 'react'
import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";
import PropTypes from "prop-types";

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

      /**
       * index or range is fully within a feature
       * @type Boolean
       */
      inFeature: false,

      /**
       * cursor points to `Feature`
       * @type Boolean
       */
      isFeature: false,

      /**
       * MouseEvent occurred in `SequenceRow` (therefore on a `Monomer`)
       * @type Boolean
       */
      onSequence: false,
    }
  }

  delete = () => {
    let range = this.context.cursor;
    if (range.hasOwnProperty('features')) {
      range = range.location;
    }
    // TODO: change selected feature range
    this.context.setSequence(this.context.sequence.delete(range));
    this.context.setCursor(null);
  }

  swap = () => {}

  replace = () => {}

  /**
   * Set `isFeature` flag when cursor points to a `Feature`
   */
  #checkIsFeature() {
    this.setState({isFeature: true, inFeature: false});
  }

  /**
   * Set `inFeature` flag when a range does not overlap any `Feature` endpoints.
   *
   * This only occurs when `cursor` points to an index or a range, _NOT_ a `Feature`.
   */
  #checkInFeature() {
    this.setState({isFeature: false})

    // assume that cursor points to a range
    if (typeof this.context.cursor !== 'number') {
      const loc = this.context.cursor;
      const features = this.context.hierarchy.within(loc[0], loc[1]);

      const filtered = features.filter((feature) => {   // filter features whose endpoint intersect with range
        return (
          (feature.global_location[0] >= loc[0] && feature.global_location[0] <= loc[1]) ||
          (feature.global_location[1] >= loc[0] && feature.global_location[1] <= loc[1])
        )
      })
      this.setState({inFeature: !filtered.length})

    } else

      this.setState({inFeature: true})

  }

  /**
   * Set `onSequence` flag when MouseEvent occurs outside of cursor or `SequenceRow`
   *
   * If clicked outside of cursor, cursor is pointed to whatever has been selected.
   * Otherwise, if clicked outside `SequenceRow`, `onSequence` flag is set to true or false depending
   * on if cursor is not null.
   *
   * @param index {number|null}
   */
  #checkOnSequence(index) {
    // MouseEvent occurred outside of cursor
    if ( (typeof this.context.cursor === 'number' && index !== this.context.cursor) || !withinBounds(index, this.context.cursor)) {
      this.context.setCursor(index);
      this.setState({onSequence: true})
    }

    // MouseEvent did not occur on `SequenceRow` and cursor is not set
    else if (index === null && this.context.cursor === null) {
      this.setState({onSequence: false});
    } else
      this.setState({onSequence: true});
  }

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

    if (index) {
      (this.context.cursor && this.context.cursor['hierarchy']) ? this.#checkIsFeature() : this.#checkInFeature();

      this.#checkOnSequence(index);
    }
    else this.setState({inFeature: false, isFeature: false, onSequence: false})

  }

  render() {
    return (
      <>
        <ContextMenu2
          onContextMenu={this.checkIntent}
          content={
            <Menu>

              <MenuItem2 text={'Create Feature'}
                         disabled={this.state.isFeature || !this.state.inFeature}
                         onClick={this.props.createFeature}
                         icon={`add-clip`}
              />

              <MenuItem2 text={'Modify Selection'}
                         disabled={!this.state.onSequence}
                         icon={`edit`} >

                <MenuItem2 text={'Insert'}
                           onClick={this.props.insertSequence}
                           icon={`add-to-artifact`} />
                <MenuItem2 text={'Delete'}
                           onClick={this.delete}
                           icon={`eraser`} />
                <MenuItem2 text={'Swap'}
                           onClick={this.swap}
                           icon={`refresh`} />
                <MenuItem2 text={'Replace'}
                           onClick={this.replace}
                           icon={`manually-entered-data`} />

              </MenuItem2>

            </Menu>
          } >

          {this.props.children}

        </ContextMenu2>
      </>
    )
  }
}

SegmentMenu.propTypes = {
  createFeature: PropTypes.func.isRequired,
  insertSequence: PropTypes.func.isRequired,
}