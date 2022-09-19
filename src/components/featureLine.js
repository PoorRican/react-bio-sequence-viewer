import React from 'react'
import PropTypes from "prop-types";

import {TruncatedFeature} from "../types/truncatedFeature";
import {colorize} from "../editor/helpers";

import './featureLine.css'

/**
 * Represents a single feature in `FeatureBar`
 *
 * @param props.feature {TruncatedFeature} - Feature object to represent
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
          gridColumn: [props.feature.truncated_location[0] + 1, props.feature.truncated_location[1] + 2].join('/'),
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
  feature: PropTypes.instanceOf(TruncatedFeature),
  highlighted: PropTypes.bool,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func,
}