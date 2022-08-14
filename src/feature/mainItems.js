import React from "react";

import Xarrow from "react-xarrows";

import RearrangeableList from "./rearrangeableList";
import {
  isLinked, isSelected,
  linkedAnchors
} from "./helpers";


/**
 * Specialized component that renders `FeatureItem` components on a line
 *
 * @param props.context {[]} - Global data to extract list of `Feature` objects, and linked and selected indices
 * @param props.itemHandlers {object} - Handler functions to pass to `FeatureItem` components
 *
 * @param props.active {boolean|number} - Adds `active` class for when a component is being actively dragged
 * @param props.expanded {boolean} - Adds `padding-right` to element to allow room for a panel
 * @param props.disabled {boolean} - Disables draggable functionality of rendered `FeatureItem` components
 * @param props.spacers {boolean} - Controls rendering of `ItemSpacer` components
 * @param props.mode {string} - Adds class of current mode to add to top-level `div` element. This currently has no purpose.
 *
 * @returns {JSX.Element}
 */
export default function MainItems(props) {

  /**
   * To conserve memory and to handle massive datasets, boolean values for `selected` and `linked` should be calculated dynamically
   * using helper functions and delegated to feature components instead of statically before rendering each component.
   */
  // calculate selected elements
  const selected = props.context.items.mainItems.map((item, index) => {
    return isSelected(props.context.selected, index, 'mainItems')
  });

  // calculate linked elements
  const [starts, ends] = linkedAnchors(props.context.items.mainItems, props.context.linked);
  const linked = {
    linked: props.context.items.mainItems.map((item, index) => {
      return isLinked(props.context.linked, index)
    }),
    starts: starts,
    ends: ends,
  }

  return (
    <div className={[
      'main',
      props.expanded ? 'expanded' : null,
      props.mode,
    ].join(' ')}>

      <RearrangeableList id={`mainItems`}
                         active={props.active} disabled={props.disabled}
                         data={props.context.items.mainItems} itemHandlers={props.itemHandlers}
                         spacers={props.spacers}
                         selected={selected}
                         linked={linked}
      />

      <Xarrow start="0" end={props.context.items.mainItems.length.toString()}
              color={'purple'}
              showHead={false}
              startAnchor='left'
              endAnchor='right'
              curveness={0}
              path={'straight'}
      />

    </div>
)
}