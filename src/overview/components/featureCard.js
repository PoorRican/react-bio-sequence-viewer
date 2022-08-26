import React from 'react'
import {Button} from "@blueprintjs/core";

/**
 * Renders a short representation of a `Feature` meant to displayed as a card.
 *
 * @param props.data.title {string} - Title of feature
 * @param props.data.id {string} - id of feature
 *
 * @returns {JSX.Element}
 * @constructor
 */
export function FeatureCard(props) {
  let data = props.data;

  return(
    <div className={`feature-content`}>
      <div style={{float: 'left'}}>
        <p>
          <strong>Title: </strong>
          <span>{data.title}</span>
        </p>
        <p>
          <strong>id: </strong>
          <span>{data.id}</span>
        </p>
      </div>
      <Button style={{float: 'right'}} minimal={true} icon={'more'}/>
    </div>
  )
}