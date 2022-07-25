import React from 'react';
import Draggable from 'react-draggable';

import './index.css'


function ItemSpacer(props) {
  return (
    <div className={`spacer`}>
      <div className={`drop-target`}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
      </div>
      <div className={`indicator`}>

      </div>
    </div>
  )
}

function RearrangeableItem(props) {

  return (
    <Draggable onStart={props.onStart} onStop={props.onStop}>
      <div className={`box drop-target rearrange-block`}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <div className={`contents`}>
          {props.children}
        </div>
      </div>
    </Draggable>
  )

}

class RearrangeableList extends React.Component {

  state = {
    activeDrags: 0,
    controlledPosition: {
      x: -400, y: 200
    },
    restricted: false
  };

  onStart = () => {
    this.setState({activeDrags: this.state.activeDrags + 1});
  };

  onStop = () => {
    this.setState({activeDrags: this.state.activeDrags - 1});
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {
      alert("Dropped!");
      e.target.classList.remove('hovered');
    }
  };

  onDropAreaMouseEnter = (e) => {
    if (e.target.classList.contains("spacer")) {
      console.log('in spacer space');
    }

    if (this.state.activeDrags && !(e.target.classList.contains("react-draggable-dragging"))) {
      e.target.classList.add('hovered');
    }
  }
  onDropAreaMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  }

  render() {
    const dragDropHandlers = {onStart: this.onStart,
                              onStop: this.onDrop,
                              onMouseEnter: this.onDropAreaMouseEnter,
                              onMouseLeave: this.onDropAreaMouseLeave};
    const dropHandlers = {onMouseEnter: this.onDropAreaMouseEnter,
                          onMouseLeave: this.onDropAreaMouseLeave};
  return (
<div>
<RearrangeableItem {...dragDropHandlers}>Test</RearrangeableItem>
        <ItemSpacer {...dropHandlers} />
        <RearrangeableItem {...dragDropHandlers}>2</RearrangeableItem>
        <ItemSpacer {...dropHandlers} />
        <RearrangeableItem {...dragDropHandlers}>3</RearrangeableItem>
      </div>
    );
  }

}

export default RearrangeableList;