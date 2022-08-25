import React from 'react'
import PropTypes from "prop-types";

import SequenceRow from "./sequenceRow";
import FeatureRowBar from "./featureRowBar";


/**
 * Encapsulates `SequenceRow` and the associated `FeatureRowBar`.
 *
 * @param props.highlighted {boolean} - Toggles highlighted styling for entire `SequenceRowGroup`
 * @param props.start {number} - First index of row
 * @param props.sequence {[string]} - Pre-processed sequence of monomers
 * @param props.features {Feature[]} - Pre-processed `Feature` objects to include
 *
 * @returns {JSX.Element}
 * @constructor
 */
export default function SequenceRowGroup(props) {
  return(
    <div className={[
           `sequence-row-group`,
            props.highlighted ? 'highlighted' : null,
         ].join(' ')}
    >

      <SequenceRow start={props.start} sequence={props.sequence}/>

      <FeatureRowBar length={props.sequence.length}>
        {props.features}
      </FeatureRowBar>

    </div>
  )
}

SequenceRowGroup.propTypes = {
  highlighted: PropTypes.bool,
  start: PropTypes.number,
  sequence: PropTypes.string,
  features: PropTypes.arrayOf(Feature)
}