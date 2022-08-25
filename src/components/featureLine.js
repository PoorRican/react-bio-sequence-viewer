import React from 'react'
import PropTypes from "prop-types";

import './featureLine.css'


/**
 * Represents a single feature in `FeatureRowBar`
 *
 * @param props.location {[number, number]} - Start and end indices
 * @param props.id {string} - Feature id
 * @param props.depth {number} - Level of nesting. Used to set `grid-row` CSS attribute.
 * @param props.color {string} - Ambiguous CSS style. Must set `background-color`
 * @param props.highlighted {boolean} - Toggles 100% opacity when highlighted
 *
 * @returns {JSX.Element}
 * @constructor
 */
function FeatureLine(props) {
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


FeatureLine.propTypes = {
  location: PropTypes.arrayOf(PropTypes.number).isRequired,
  id: PropTypes.string.isRequired,
  depth: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  highlighted: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
}

export default FeatureLine;