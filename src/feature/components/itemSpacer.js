import React from "react";

export function ItemSpacer(props) {
  return (
    <div className={`spacer`} id={props.id} style={props.style}>
      <div className={`drop-target`}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      </div>
      <div className={`indicator`}>

      </div>
    </div>
  )
}