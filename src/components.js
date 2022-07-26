import React from 'react';
import Draggable from 'react-draggable';

import './index.css'


function ItemSpacer(props) {
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

function ListItem(props) {

  return (
    /* TODO: I don't like using an unnecessary element */
    <div hidden={props.hidden}>
      <ItemSpacer onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave} id={props.id}/>
      <Draggable onStart={props.onStart} onStop={props.onStop} onDrag={props.onDrag}
                 position={props.position}
                 defaultPosition={props.defaultPosition}>
        <div id={props.id} className={`box drop-target rearrange-block ` + props.className}
             onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
          <div className={`contents`}>
            {props.children}
          </div>
        </div>
      </Draggable>
    </div>
  )

}

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

class RearrangeableList extends React.Component {

  constructor(props) {
    super(props);


    this.state = {
      items: props.items,
      activeDrags: 0,
      controlledPosition: {
        x: null, y: null
      },
      selected: {
        key: null,
        content: null,
      },
    };
  }

  getItem(key) {
    return this.state.items[key];
  }

  // handler functions
  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    // select element
    const parent = e.target.parentElement;
    if (!parent.classList.contains('selected')) {
      const key = Number(parent.id);
      const content = this.state.items[key]
      this.setState({
        selected: {
          key: key,
          content: content,
        }
      });
      console.debug('changed selection')
    }
  };

  onDrop = (e) => {
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {
      this.setState({activeDrags: this.state.activeDrags - 1});

      e.target.classList.remove('hovered');

      const selected = this.state.selected;
      const key = e.target.parentNode.id;
      const items = this.insert(this.state.items, selected.content, key);
      this.setState({items: items});

      alert("Dropped!");
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

  handleDrag = (e, position) => {
    if (this.state.activeDrags) {
      const {x, y} = position;
      this.setState({
        controlledPosition: {x, y}
      });
    }
  };

  // list manipulation functions

  insert(list, item, position) {
    const s1 = list.slice(0, position).concat([item]);
    const s2 = list.slice(position);
    return s1.concat(s2)
  }

  delete(list, position) {
    const s1 = list.slice(0, position);
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  }

  swap(list, item, position) {
    const s1 = list.slice(0, position).concat({item});
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  }

  render() {
    const dragDropHandlers = {onStart: this.onStart,
                              onStop: this.onDrop,
                              onDrag: this.handleDrag,
                              onMouseEnter: this.onDropAreaMouseEnter,
                              onMouseLeave: this.onDropAreaMouseLeave};
    const dropHandlers = {onMouseEnter: this.onDropAreaMouseEnter,
                          onMouseLeave: this.onDropAreaMouseLeave};

    return (
      <div className={this.state.activeDrags ? 'active' : ''}>
        {/*
        <div style={{position: `absolute`}}>
          <ListItem className={`selected`} hidden={this.state.selected.key === null}
                    id={this.state.selected.key} {...dragDropHandlers}
                    position={this.state.controlledPosition}
                    defaultPosition={{x: -300, y: -300}}>
            {this.state.selected.content}
          </ListItem>
        </div>
        */}

        {this.state.items.map((item, index) =>
          <ListItem key={index.toString()} id={index} position={{x: 0, y: 0}} {...dragDropHandlers}>{item}</ListItem>)
        }
        <ItemSpacer id={this.state.items.length}{...dropHandlers} />

      </div>
    );
  }

}

export default RearrangeableList;