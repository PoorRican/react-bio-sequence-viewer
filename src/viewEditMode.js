import {
  Classes,
  Button,
  Navbar,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core";
import RearrangeableList from "./rearrangeableList";
import React from "react";

function EditMenu(props) {
  return (
    <Navbar>
      <NavbarGroup>
        <Button large={true} className={Classes.MINIMAL}
                icon={`edit`} text={`Edit`}
                active={props.mode === 'edit'}
                onClick={props.editAction}
        />
        <Button large={true} className={Classes.MINIMAL}
                icon={`eye-open`} text={`View`}
                active={props.mode === 'view'}
                onClick={props.viewAction}
        />
      </NavbarGroup>
    </Navbar>
  )
}

export class ViewEditMode extends React.Component {
  constructor(props) {
    super(props);

    let items = props.items;
    if (items === undefined) {
      items = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    }

    this.state = {
      mode: 'view',
      items: items,
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
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {

      const selected = this.state.selected;
      const key = e.target.parentNode.id;
      const items = this.insert(this.state.items, selected.content, key);
      this.setState({items: items});

      alert("Dropped!");
    }
  };

  onDropAreaMouseEnter = (e) => {
    if (this.state.activeDrags && !(e.target.classList.contains("react-draggable-dragging"))) {
    }
  }
  onDropAreaMouseLeave = (e) => {
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
  getItem(key) {
    return this.state.items[key];
  }

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

  // Mode functions
  viewAction = (e) => {
    this.setState({'mode': 'view'});
  }

  editAction = (e) => {
    this.setState({'mode': 'edit'});
  }

  render() {
    // view props
    const disabled = this.state.mode === 'view';

    // handlers
    let itemHandlers = null;
    let spacerHandlers = null;
    if (this.state.mode === 'edit') {
      itemHandlers = {
        onStart: this.onStart,
        onStop: this.onDrop,
        onDrag: this.handleDrag,
        onMouseEnter: this.onDropAreaMouseEnter,
        onMouseLeave: this.onDropAreaMouseLeave};
      spacerHandlers = {
        onMouseEnter: this.onDropAreaMouseEnter,
        onMouseLeave: this.onDropAreaMouseLeave};
    }

    return (
      <div>

        <EditMenu mode={this.state.mode}
                  viewAction={this.viewAction}
                  editAction={this.editAction}
        />

        <RearrangeableList items={this.state.items}
                           active={this.state.activeDrags}
                           disabled={disabled}
                           itemHandlers={itemHandlers}
                           spacerHandlers={spacerHandlers}
        />

      </div>
    );
  }
}