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
    <div>
      <Draggable onStart={props.onStart} onStop={props.onStop}>
        <div className={`box drop-target rearrange-block`}
             onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
          <div className={`contents`}>
            {props.children}
          </div>
        </div>
      </Draggable>
      <ItemSpacer onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} />
    </div>
  )

}

class RearrangeableList extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      items: props.items,
      activeDrags: 0,
      controlledPosition: {
        x: -400, y: 200
      },
    };
  }

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
      <div className={this.state.activeDrags ? 'active' : ''}>
        <ItemSpacer {...dropHandlers} />
        {this.state.items.map((item, index) =>
          <RearrangeableItem key={index.toString()} {...dragDropHandlers}>{item}</RearrangeableItem>)
        }
      </div>
    );
  }

}

export default RearrangeableList;