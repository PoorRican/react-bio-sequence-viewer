import Draggable from "react-draggable";
import React from "react";

function DroppableItem(props) {

  return (
    <Draggable onStart={props.onStart} onStop={props.onStop}>
      <div id={props.id} className={`box rearrange-block`} hidden={props.hidden}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <div className={`contents`}>
          {props.children}
        </div>
      </div>
    </Draggable>
  )
}