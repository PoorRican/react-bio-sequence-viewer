import {ItemSpacer} from "./itemSpacer";
import Draggable from "react-draggable";
import React from "react";
import { Card, Elevation } from "@blueprintjs/core";

export function ListItem(props) {

  return (
    /* TODO: I don't like using an unnecessary element */
    <div hidden={props.hidden}>
      <ItemSpacer onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} id={props.id}/>
      <Draggable onStart={props.onStart} onStop={props.onStop} onDrag={props.onDrag}
                 position={props.position}
                 defaultPosition={props.defaultPosition}>
        <Card interactive={true}
              id={props.id}
              className={`box drop-target rearrange-block ` + props.className}
              onMouseEnter={props.onMouseEnter}
              onMouseLeave={props.onMouseLeave}>
          <div className={`contents`}>
            {props.children}
          </div>
        </Card>
      </Draggable>
    </div>
  )

}