import React from 'react';
import Draggable from 'react-draggable';

import './index.css'

function RearrangeBlock(props) {

  return (
    <Draggable onStart={props.onStart} onStop={props.onStop}>
      <div className={`box drop-target rearrange-block`}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        {props.children}
      </div>
    </Draggable>
  )

}

class Grid extends React.Component {

  state = {
    deltaPosition: {
      x: 0, y: 0
    },
    activeDrags: 0,
    controlledPosition: {
      x: -400, y: 200
    },
    restricted: false
  };

  onStart = () => {
    this.setState({activeDrags: this.state.activeDrags + 1});
    console.log('started ' + this.state.activeDrags)
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
    console.log(this.state.activeDrags)
    if (this.state.activeDrags && !(e.target.classList.contains("react-draggable-dragging"))) {
      e.target.classList.add('hovered');
    }
    console.log(e.target);
  }
  onDropAreaMouseLeave = (e) => {
    e.target.classList.remove('hovered');
  }

  handleDrag = (e, ui) => {
    const {x, y} = this.state.deltaPosition;
    this.setState({
      deltaPosition: {
        x: x + ui.deltaX,
        y: y + ui.deltaY,
      }
    });
  };

  render() {
    const dragHandlers = {onStart: this.onStart, onStop: this.onDrop};
    const dropHandlers = {onMouseEnter: this.onDropAreaMouseEnter, onMouseLeave: this.onDropAreaMouseLeave}
    return (
      <div>
        <RearrangeBlock {...dragHandlers} onMouseEnter={this.onDropAreaMouseEnter} onMouseLeave={this.onDropAreaMouseLeave}>Test</RearrangeBlock>
        <RearrangeBlock {...dragHandlers} onMouseEnter={this.onDropAreaMouseEnter} onMouseLeave={this.onDropAreaMouseLeave}>2</RearrangeBlock>
        <RearrangeBlock {...dragHandlers} onMouseEnter={this.onDropAreaMouseEnter} onMouseLeave={this.onDropAreaMouseLeave}>3</RearrangeBlock>
      </div>
    );
  }

}

export default Grid;