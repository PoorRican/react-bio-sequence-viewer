import React from 'react'
import {
  UL,
  Classes,
} from '@blueprintjs/core'

import './featureBar.css'


/**
 * Returns a slice of given `hierarchy` based on given index range as a flat array of `FeatureLine` components.
 *
 * Features and their sub-features are notated by `depth` attribute.
 *
 * *Must* be used to process features in `FeatureBar`
 *
 * @param hierarchy {[{},]} - Array of features to scrub
 * @param start {number} - Inclusive start index
 * @param end {number} - Inclusive ending index
 * @param depth {number} - Level of hierarchy nesting. Used for recursion when iterating through sub-features.
 *
 * @returns {[JSX.Element]} - Flattened array of features and sub-features
 */
export function flattenHierarchy(hierarchy, start, end, depth=0) {
  let contained = [];
  const width = Math.abs(end - start);
  for (let feature of hierarchy) {
    const loc = feature.location
    if (loc[0] <= end && loc[1] >= start) {

      // truncate `start` & `end` indices
      const trunc_start = loc[0] <= start ? 0 : (loc[0] % width);
      const trunc_end = loc[1] >= end ? width : (loc[1] % width);

      contained.push(
        <FeatureLine key={feature.id}
                     id={feature.id}
                     location={[trunc_start, trunc_end]}
                     depth={feature.depth}
        />
      );

      // get sub-features within boundaries
      if (feature.features) {
        const sub = flattenHierarchy(feature.features, start, end, depth + 1);
        contained = contained.concat(sub);
      }

    }
  }
  return contained
}


/**
 * Represents a single feature in `FeatureBar`
 *
 * @param props.location {[number, number]} - Start and end indices
 * @param props.id {string} - Feature id
 * @param props.depth {number} - Level of nesting. Used to set `grid-row` CSS attribute.
 *
 * @returns {JSX.Element}
 * @constructor
 */
function FeatureLine(props) {
  return(
    <li id={props.id}
        className={`feature-line`}
        style={{
          gridRow: props.depth,
          gridColumn: [props.location[0] + 1, props.location[1] + 1].join('/'),
        }}
    >
      <span>{props.id}</span>
    </li>
  )
}


/**
 * Renders hierarchy structure of features as simple lines.
 *
 * Hierarchy is passed via `props.children`.
 *
 * @param props.children {[{},]} - Hierarchy to display
 * @param props.scroll {boolean} - Toggles scrollbar functionality
 * @param props.width {number} - The number of indices to be represented.
 * @param props.range {[number, number]} - Optional argument that defines start and end point.
 * If not passed, then the entire hierarchy is used.
 */
export default class FeatureBar extends React.Component {
  constructor(props) {
    super(props)

    if (props.range === undefined) {
      this.start = 0;
      this.end = this.props.width;
    } else {
      [this.start, this.end] = props.range;
    }
  }

  render() {
    return(
      <UL className={[
            `feature-bar`,
            Classes.LIST_UNSTYLED,
          ].join(' ')}
          style={{gridTemplateColumns: 'repeat(auto-fill, calc(100% / ' + this.props.width + ')'}}>

        {flattenHierarchy(this.props.children, this.start, this.end)}

      </UL>
    )
  }
}