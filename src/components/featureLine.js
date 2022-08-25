import React from 'react'

import './featureLine.css'


/**
 * Represents a single feature in `FeatureRowBar`
 *
 * @param props.location {[number, number]} - Start and end indices
 * @param props.id {string} - Feature id
 * @param props.depth {number} - Level of nesting. Used to set `grid-row` CSS attribute.
 * @param props.highlighted {boolean} - Toggles 100% opacity when highlighted
 * @param props.color {string} - Ambiguous CSS style. Must set `background-color`
 *
 * @returns {JSX.Element}
 * @constructor
 */
export function FeatureLine(props) {
  return(
    <li id={props.id}
        className={[
          `feature-line`,
          props.color,
          props.highlighted ? 'highlighted' : null,
        ].join(' ')}
        style={{
          gridRow: props.depth + 1,
          gridColumn: [props.location[0] + 1, props.location[1] + 2].join('/'),
        }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
    >
      <span>{props.id}</span>
    </li>
  )
}


