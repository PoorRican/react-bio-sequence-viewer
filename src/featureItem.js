import {ItemSpacer} from "./itemSpacer";
import Draggable from "react-draggable";
import React from "react";
import {
  Card,
} from "@blueprintjs/core";


export function FeatureItem(props) {

  return (
    <Draggable onStart={props.onStart}
               onStop={props.onStop}
               onDrag={props.onDrag}
               position={{x: 0, y: 0}}
               defaultPosition={props.defaultPosition}
               disabled={props.disabled}
    >
      <Card
            id={props.id}
            className={[
              `feature drop-target`,
              props.className,
              props.disabled ? 'disabled' : '',
            ].join(' ')}
            onMouseEnter={props.onMouseEnter}
            onMouseLeave={props.onMouseLeave}>
        <div className={`contents`}>
          {props.children}
        </div>
      </Card>
    </Draggable>
  )


}