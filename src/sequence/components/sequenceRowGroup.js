import React from 'react'
import SequenceRow from "./sequenceRow";
import FeatureRowBar from "./featureRowBar";


/**
 * Bundles `SequenceRow` and the associated `FeatureRowBar`.
 *
 * @param props.highlighted {boolean} - Toggles highlighted styling
 * @param props.start {number} - First index of row
 * @param props.sequence {[string]} - Pre-processed sequence of monomers
 * @param props.features {[{},]} - Pre-processed `Feature` objects to include
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