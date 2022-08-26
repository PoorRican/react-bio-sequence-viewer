import React from 'react'
import PropTypes from "prop-types";

import SequenceRow from "./sequenceRow";
import FeatureBar from "../../components/featureBar";


/**
 * Encapsulates `SequenceRow` and the associated `FeatureBar`.
 *
 * @param props.highlighted {boolean} - Toggles highlighted styling for entire `SequenceRowGroup`
 * @param props.start {number} - First index of row
 * @param props.sequence {string[]} - Pre-processed sequence of monomers
 * @param props.features {Feature[]|{}[]} - Pre-processed `Feature` objects to include
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

      <SequenceRow start={props.start}
                   sequence={props.sequence} />

      <FeatureBar length={props.sequence.length}
                  features={props.features} />

    </div>
  )
}

SequenceRowGroup.propTypes = {
  highlighted: PropTypes.bool,
  start: PropTypes.number.isRequired,
  sequence: PropTypes.arrayOf(PropTypes.string).isRequired,
  features: PropTypes.array.isRequired
}