import React from 'react'
import PropTypes from "prop-types";

import {Feature} from "../types/feature";
import {colorize} from "../editor/helpers";

import './featureLine.css'

/**
 * Represents a single feature in `FeatureBar`
 *
 * @param props.feature {Feature} - Feature object to represent
 * @param props.highlighted {boolean} - Toggles 100% opacity when highlighted
 * @param props.onMouseEnter {function} - Event callback for mouse hovering
 * @param props.onMouseLeave {function} - Event callback for when mouse leaves
 *
 * @returns {JSX.Element}
 * @constructor
 */
export function FeatureLine(props) {
  return(
    <li id={props.feature.accessor}
        className={[
          `feature-line`,
          colorize(props.feature.depth),
          props.highlighted ? 'highlighted' : null,
        ].join(' ')}
        style={{
          gridRow: props.feature.depth + 1,
          gridColumn: [props.feature.location[0] + 1, props.feature.location[1] + 2].join('/'),
        }}
        onMouseEnter={props.onMouseEnter}
        onMouseLeave={props.onMouseLeave}
        onClick={props.onClick}
    >
      <span>{props.feature.accessor}</span>
    </li>
  )
}


FeatureLine.propTypes = {
  feature: PropTypes.instanceOf(Feature),
  highlighted: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func,
}