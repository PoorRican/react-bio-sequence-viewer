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

function ListItem(props) {

  return (
    /* TODO: I don't like using an unnecessary element */
    <div>
      <Draggable onStart={props.onStart} onStop={props.onStop}>
        <div id={props.id} className={`box drop-target rearrange-block`} hidden={props.hidden}
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

function DroppableItem(props) {

  return (
    <Draggable onStart={props.onStart} onStop={props.onStop}>
      <div id={props.id} className={`box rearrange-block no-cursor`} hidden={props.hidden}
           onMouseEnter={props.onMouseEnter} onMouseLeave={props.onMouseLeave}>
        <div className={`contents`}>
          <strong className={`cursor`}><div>Drag Here</div></strong>
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
        x: -400, y: 200
      },
      selected: {
        key: null,
        content: null,
        deltaPosition: {
          x: null, y: null,
        },
        deleted: false,
      },
    };
  }

  // handler functions
  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    const parent = e.target.parentElement;
    // parent.classList.add('selected');

    const _key = Number(parent.id);
    const content = this.state.items[_key]
    console.log(_key)
    this.setState({
      selected: {
        key: _key,
        content: content,
      }
    });
  };

  onDrop = (e) => {
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {
      this.setState({activeDrags: this.state.activeDrags - 1});
      alert("Dropped!");
      e.target.classList.remove('hovered');
    }
    else {
      // reset parent 'style' attr
      const key = this.state.selected.key;

      const sliced1 = this.state.items.slice(0, key);
      const sliced2 = this.state.items.slice(key + 1);

      this.setState({
        items: sliced1.concat(sliced2),
        selected: {
          deleted: true,
        }
      });
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

  handleDrag = (e, ui) => {
    if (this.state.activeDrags && (e.target.classList.contains("react-draggable-dragging"))) {
      const {x, y} = this.state.selected.deltaPosition;
      this.setState({
        selected: {
          deltaPosition:
            {
              x: x + ui.deltaX,
              y: y + ui.deltaY,
            }
        }
      });
    }
  };

  // list manipulation functions

  insert(list, item, position) {
    const s1 = list.slice(0, position).concat({item});
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
    const _selected = this.state.selected;
    const selected = <ListItem className={`selected`} hidden={!_selected.deleted}
                                        id={_selected.key} {...dragDropHandlers}
                                  position={_selected.deltaPosition}>
      {_selected.content}
    </ListItem>
    return (
      <div className={this.state.activeDrags ? 'active' : ''}>
        { selected }
        <DroppableItem {...dragDropHandlers}>Test</DroppableItem>
        <ItemSpacer {...dropHandlers} />
        {this.state.items.map((item, index) =>
          <ListItem key={index.toString()} id={index} {...dragDropHandlers}>{item}</ListItem>)
        }
      </div>
    );
  }

}

export default RearrangeableList;