import React from "react";
import {
  Button,
  Navbar, NavbarGroup,
  Menu,
  H1,
} from "@blueprintjs/core";
import {MenuItem2} from "@blueprintjs/popover2";
import Xarrow from "react-xarrows";

import RearrangeableList from "./rearrangeableList";

import './viewEditMode.css'

function ModeMenu(props) {
  return (
    <Navbar style={{
      position: 'fixed',
      zIndex: 11
    }}>
      <NavbarGroup>
        <Button large={true} minimal={true} fill={true}
                icon={`insert`} text={`Insert`}
                active={props.mode === 'insert'}
                onClick={props.insertAction}
        />
        <Button large={true} minimal={true} fill={true}
                icon={`eye-open`} text={`View`}
                active={props.mode === 'view'}
                onClick={props.viewAction}
        />
        <Button large={true} minimal={true} fill={true}
                icon={`move`} text={`Move`}
                active={props.mode === 'move'}
                onClick={props.moveAction}
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

    let availableItems = props.availableItems;
    if (availableItems === undefined) {
      availableItems = [10,11,12,13,14,15,16,17,18,19];
    }

    this.state = {
      mode: 'view',
      items: items,
      availableItems: availableItems,
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

  // container functions
  getContainer(target) {
    const id = target.id
    if (id === `mainItems`) {
      return this.state.items;
    } else if (id === `availableItems`) {
      return this.state.availableItems;
    } else {
      return this.getContainer(target.parentNode);
    }
  }

  getItemId(target) {
    if (target.id === '') {
      return this.getItemId(target.parentNode);
    }
    return target.id;
  }

  // handler functions
  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    // select element
    if (!e.target.classList.contains('selected')) {
      const key = Number(this.getItemId(e.target));
      const container = this.getContainer(e.target);
      const content = container[key]
      this.setState({
        selected: {
          key: key,
          content: content,
        }
      });
    }
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {

      const selected = this.state.selected;
      const key = Number(this.getItemId(e.target));

      let items;
      if (this.state.mode === `insert`) {
        items = this.insert(this.state.items, selected.content, key);
      }
      else if (this.state.mode === 'move') {
        items = this.move(this.state.items, selected.content, [selected.key, key])
      } else {
        items = this.state.items;
      }
      this.setState({items: items});
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

  // updates `this.state.selected` when opening context menu
  onContextMenu = (e, position) => {
    const key = Number(this.getItemId(e.target));
    const content = this.state.items[key]
    this.setState({
      selected: {
        key: key,
        content: content,
      }
    });
  }

  contextMenu = () => {
    return (
      <Menu>
        <MenuItem2 text={`Delete`}
                   icon={`trash`}
                   onClick={this.doDelete}
                   intent={`danger`}
        />
      </Menu>
    )
  }

  // list manipulation functions
  getItem(key) {
    return this.state.items[key];
  }

  insert(list, item, position) {
    const s1 = list.slice(0, position).concat([item]);
    const s2 = list.slice(position);
    return s1.concat(s2)
  }

  move(list, item, positions) {
    if (positions[0] === positions[1]) {
      console.debug('same same')
      return list;
    }

    const start = Math.min(Number(positions[0]), Number(positions[1]))
    const end = Math.max(Number(positions[0]), Number(positions[1]))

    const s1 = list.slice(0, start)
    let s2, s3 = null;
    if (positions[0] > start) {
      s2 = [item].concat(list.slice(start, end))
      s3 = list.slice(end+1)
    } else {
      s2 = list.slice(start+1, end).concat([item])
      s3 = list.slice(end)
    }
    return s1.concat(s2).concat(s3)
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

  insertAction = (e) => {
    this.setState({'mode': 'insert'});
  }

  moveAction = (e) => {
    this.setState({'mode': 'move'})
  }

  // Context menu functions
  doDelete = (e) => {
    this.setState({
        items: this.delete(this.state.items, this.state.selected.key)
    })
  }

  render() {
    // view props
    let disabled = this.state.mode === 'view';

    // handlers
    let itemHandlers = null
    let spacerHandlers          = null;
    if (
      this.state.mode === 'move' ||
      this.state.mode === 'insert'
    ) {
      itemHandlers = {
        onStart: this.onStart,
        onStop: this.onDrop,
        onDrag: this.handleDrag,
        onMouseEnter: this.onDropAreaMouseEnter,
        onMouseLeave: this.onDropAreaMouseLeave};
      spacerHandlers = {
        onMouseEnter: this.onDropAreaMouseEnter,
        onMouseLeave: this.onDropAreaMouseLeave};
      disabled = this.state.activeDrags;
    }


    return (
      <div>

        <ModeMenu mode={this.state.mode}
                  viewAction={this.viewAction}
                  insertAction={this.insertAction}
                  moveAction={this.moveAction}
        />

        <div className={`feature-space`}>

          <div className={`main`}>
            <H1>Main Items:</H1>
            <RearrangeableList id={`mainItems`}
                               active={this.state.activeDrags}
                               disabled={disabled}
                               itemHandlers={itemHandlers}
                               spacerHandlers={spacerHandlers}
                               contextMenu={this.contextMenu}
                               onContextMenu={this.onContextMenu}
            >
              {this.state.items}
            </RearrangeableList>

            <Xarrow start='0' end={this.state.items.length.toString()}
                    color={'purple'}
                    showHead={false}
                    startAnchor='left'
                    endAnchor='right'
            />
          </div>{/* /.main */}

          <div className={`selection bp4-elevation-2`}>
            <H1>Available Items:</H1>
            <RearrangeableList id={`availableItems`}
                               itemHandlers={itemHandlers}
                               spacerHandlers={spacerHandlers}
            >
              {this.state.availableItems}
            </RearrangeableList>
          </div>{/* /.section */}

        </div>{/* /.feature-space */}

      </div>
    );
  }
}