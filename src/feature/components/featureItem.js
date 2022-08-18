import Draggable from "react-draggable";
import React from "react";
import {
  Card,
} from "@blueprintjs/core";

import {FeatureCard} from "./featureCard";


export function FeatureItem(props) {

  return (
    <Draggable onStart={props.onStart}
               onStop={props.onStop}
               onDrag={props.onDrag}
               position={props.position ? props.position : {x: 0, y: 0}}
               defaultPosition={props.defaultPosition}
               disabled={props.disabled}
    >
      <Card
            id={props.id}
            className={[
              `feature drop-target`,
              props.className,
              props.disabled ? 'disabled' : '',
              props.selected ? 'selected' : '',
            ].join(' ')}
            onClick={props.onClick}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
        <FeatureCard data={props.data} />
      </Card>
    </Draggable>
  )


}