import React from 'react'
import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";
import PropTypes from "prop-types";

import {EditorContext} from '../data'
import {withinBounds} from "../helpers";
import {isFeatureLine} from "../../components/helpers";


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
       *
       * Disables 'Create Feature' menu option.
       *
       * @type Boolean
       */
      inFeature: false,

      /**
       * cursor points to `Feature`.
       *
       * Disables 'Create Feature' menu option.
       *
       * @type Boolean
       */
      isFeature: false,

      /**
       * MouseEvent occurred in `SequenceRow` (therefore on a `Monomer`).
       *
       * Disables both 'Create Feature` and `Modify Sequence' options.
       *
       * @type Boolean
       */
      onSequence: false,
    }
  }

  // Sequence Methods

  insert = () => {
    this.context.setMode('insert');
    this.props.editSequence();
  }

  /**
   * Delete sequences at cursor
   */
  delete = () => {
    let range = this.context.cursor;

    if (range.hasOwnProperty('features'))
      range = range.location;
    else if (typeof this.context.cursor === 'number')
      range = [this.context.cursor, this.context.cursor]

    const magnitude = range[1] - range[0] + 1;

    this.context.setSequence(this.context.sequence.delete(range))

    this.context.mediator().resize(-magnitude, range[0]);

    this.context.setCursor(null);
  }

  swap = () => {}

  replace = () => {
    this.context.setMode('replace');
    this.props.editSequence();
  }

  // Feature Methods

  removeFeature = () => {
    const updated = this.context.hierarchy.delete(this.context.cursor.accessor, true);
    this.context.setHierarchy(updated);
  }

  /**
   * Set `isFeature` flag when cursor points to a `Feature`
   */
  #setIsFeature() {
    this.setState({isFeature: true, inFeature: false});
  }

  /**
   * Set `inFeature` flag if `context.cursor` does not partially overlap any features.
   *
   * @description Should only be called when `cursor` points to an index or a range, _NOT_ a `Feature`
   * and is used to disable the `Create Feature` menu option.
   *
   * @description **Example:** If `context.cursor` points to (25,30) and there is a `Feature` that example
   * extends from (20,26), `state.inFeature = false`.
   */
  #checkInFeature() {
    this.setState({isFeature: false})

    /**
     * Assume that cursor points to a range or number and not a `Feature`
     */
    if (typeof this.context.cursor !== 'number') {
      const loc = this.context.cursor;
      const features = this.context.hierarchy.within(loc[0], loc[1]);

      /**
       * Features where both endpoints aren't fully inside or fully outside range.
       *
       * @type {RenderFeature[]}
       */
      const partially = features.filter((feature) => {
        const inside  = feature.location[0] >= loc[0] && feature.location[1] <= loc[1]
        const outside = feature.location[0] <= loc[0] && feature.location[1] >= loc[1]
        return !(inside || outside)
      })

      this.setState({inFeature: features.length ? !Boolean(partially.length) : true})

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
    // Updated cursor if MouseEvent occurred outside of cursor
    if ( (typeof this.context.cursor === 'number' && index !== this.context.cursor) ||
      (this.context.cursor['location'] === undefined && !withinBounds(index, this.context.cursor)) ||
      (this.context.cursor['location'] && !withinBounds(index, this.context.cursor.location))) {

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
   * Sets `cursor` and internal state before rendering menu.
   * Value of `cursor` gets changed when `MouseEvent` has fired on a `FeatureLine`,
   * or when `Monomer` outside `cursor` range.
   *
   * @param e {MouseEvent}
   *
   * @see Sequence
   */
  checkIntent = (e) => {

    const index = getIndex(e.target);

    if (index) {

      if (this.context.cursor === null)
        this.context.setCursor(index);
      else
        this.context.cursor['location'] ? this.#setIsFeature() : this.#checkInFeature();

      this.#checkOnSequence(index);
    }

    else if (isFeatureLine(e)) {
      this.context.setCursor(e.target.id);

      this.#setIsFeature();
      this.setState({onSequence: false});
    }

    else
      this.setState({inFeature: false, isFeature: false, onSequence: false})

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
                         icon={`add-clip`} />

              <MenuItem2 text={'Edit Feature'}
                         disabled={!this.state.isFeature || this.state.onSequence}
                         onClick={this.props.editFeature}
                         icon={'annotation'} />

              <MenuItem2 text={'Remove Feature/Annotation'}
                         disabled={!this.state.isFeature || this.state.onSequence}
                         onClick={this.removeFeature}
                         icon={'remove'} />

              <MenuItem2 text={'Modify Selection'}
                         disabled={!this.state.onSequence}
                         icon={`edit`} >

                <MenuItem2 text={'Insert'}
                           onClick={this.insert}
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
  /**
   * Opens `CreateFeatureDialog`
   * @see SequenceText.createFeature
   */
  createFeature: PropTypes.func.isRequired,
  /**
   * Opens `EditFeatureDialog`
   * @see SequenceText.editFeature
   */
  editFeature: PropTypes.func.isRequired,

  /**
   * Opens `EditSequenceDialog`
   * @see SequenceText.editSequence
   */
  editSequence: PropTypes.func.isRequired,
}