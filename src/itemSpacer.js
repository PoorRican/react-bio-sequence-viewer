import React from "react";

export function ItemSpacer(props) {
  return (
    <div className={`spacer`} id={props.id}>
      <div className={`drop-target`}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      </div>
      <div className={`indicator`}>

      </div>
    </div>
  )
}