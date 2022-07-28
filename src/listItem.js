import {ItemSpacer} from "./itemSpacer";
import Draggable from "react-draggable";
import React from "react";
import {
  Card,
  Menu,
} from "@blueprintjs/core";
import {
  ContextMenu2,
  MenuItem2
} from "@blueprintjs/popover2";


export function ListItem(props) {

  return (
    /* TODO: I don't like using an unnecessary element */
    <div hidden={props.hidden}>
      <ItemSpacer onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} id={props.id}/>
      <ContextMenu2
        disabled={props.disabled}
        content={props.contextMenu}
        onContextMenu={props.onContextMenu}
      >
        <Draggable onStart={props.onStart} onStop={props.onStop} onDrag={props.onDrag}
                   position={{x: 0, y: 0}}
                   defaultPosition={props.defaultPosition}>
          <Card interactive={!props.disabled}
                id={props.id}
                className={[
                  `box drop-target rearrange-block`,
                  props.className,
                  props.disabled ? 'no-pointer-events' : '',
                ].join(' ')}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave}>
            <div className={`contents`}>
              {props.children}
            </div>
          </Card>
        </Draggable>
      </ContextMenu2>
    </div>
  )

}