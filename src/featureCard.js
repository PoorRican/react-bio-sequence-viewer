import {React} from 'react'
import {Button} from "@blueprintjs/core";

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