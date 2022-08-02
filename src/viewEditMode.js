import React from "react";
import {
  Button,
  Navbar,
  Menu,
  H1,
} from "@blueprintjs/core";
import {
  MenuItem2,
  ContextMenu2
} from "@blueprintjs/popover2";
import {
} from "@blueprintjs/popover2";
import Xarrow from "react-xarrows";

import RearrangeableList from "./rearrangeableList";

import './viewEditMode.css'

function ModeMenu(props) {
  return (
    <Navbar style={{
      position: 'fixed',
      zIndex: 11
    }}>
      <Navbar.Group>

        <Navbar.Heading style={{
                          minWidth: '75px',
                          display: 'block',
                        }}>
          {props.heading}
        </Navbar.Heading>

        <Navbar.Divider />

        {props.buttons.map((i) =>
          <Button key={i.mode} large={true} minimal={true} fill={true}
                  icon={i.icon} text={i.text}
                  active={props.mode === i.mode}
                  onClick={i.action}
          />
        )}

      </Navbar.Group>
    </Navbar>
  )
}

export class ViewEditMode extends React.Component {
  static isStaticMode(mode) {
    const modes = ['view', 'select'];
    return Boolean(modes.indexOf(mode) + 1);
  }

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
      selecting: false,
    };
  }

  // container functions
  isFeature(target) {
    if (target) {
      if (target.classList && target.classList.contains('feature')) {
        return true;
      } else {
        return this.isFeature(target.parentNode)
      }
    }
  }

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
  onClick = (e) => {
    if (this.state.mode === 'select') {
      if (this.state.selecting) {
        const prev_sel_key = this.state.selected.key
        const key = Number(this.getItemId(e.target));

        let keys = [];
        let contents = [];

        if (key > prev_sel_key) {
          this.setState({
            selected: {
              key:      [prev_sel_key, key],
              content:  this.state.items.slice(prev_sel_key, key),
            }
          })
        } else {
          this.setState({
            selected: {
              key:      [key, prev_sel_key],
              content:  this.state.items.slice(key, prev_sel_key),
            }
          })
        }

      } else {
        // this runs first
        const key = Number(this.getItemId(e.target));
        const content = this.state.items[key]
        this.setState({
          selected: {
            key: key,
            content: content,
          }
        });
      }

      this.setState({selecting: !this.state.selecting})
    }
  }
  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    const key = Number(this.getItemId(e.target));
    const container = this.getContainer(e.target);
    const content = container[key]
    this.setState({
        selected: {
          key: key,
          content: content,
        }
      });
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {

      const selected = this.state.selected;
      const key = Number(this.getItemId(e.target));

      let items;
      if (this.state.mode === `insert`) {
        items = ViewEditMode.insert(this.state.items, selected.content, key);
      }
      else if (this.state.mode === 'move') {
        items = ViewEditMode.move(this.state.items, selected.content, [selected.key, key])
      } else {
        return;
      }
      this.setState({items: items});
    }
  };

  handleDrag = (e, position) => {
    if (this.state.activeDrags) {
      const {x, y} = position;
      this.setState({
        controlledPosition: {x, y}
      });
    }
  };

  // updates `this.state.selected` when opening context menu
  onContextMenu = (e) => {
    const inFeature = this.isFeature(e.target);
    if (inFeature) {
      const key = Number(this.getItemId(e.target));
      const content = this.getItem(key);
      this.setState({
        selected: {
          key: key,
          content: content,
        }
      });
    } else {
      this.setState({
        selected: {
          key: null,
          content: null,
        }
      })
    }
  }

  contextMenu = () => {

    return (
      <Menu>
        <MenuItem2 text={`Delete`}
                   icon={`trash`}
                   onClick={this.doDelete}
                   intent={`danger`}
                   disabled={(this.state.selected.key === null)}
        />
      </Menu>
    )
  }

  // list manipulation functions
  getItem(key) {
    return this.state.items[key];
  }

  static insert(list, item, position) {
    const s1 = list.slice(0, position).concat([item]);
    const s2 = list.slice(position);
    return s1.concat(s2)
  }

  static move(list, item, positions) {
    if (positions[0] === positions[1]) {
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

  static delete(list, position) {
    const s1 = list.slice(0, position);
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  }

  static swap(list, item, position) {
    const s1 = list.slice(0, position).concat({item});
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  }

  // Context menu functions
  doDelete = (e) => {
    this.setState({
        items: ViewEditMode.delete(this.state.items, this.state.selected.key)
    })
  }

  render() {
    const menu_buttons = [
      {
        mode: 'view',
        icon: 'eye-open',
        text: 'View',
        action: () => this.setState({mode: 'view'})
      },
      {
        mode: 'select',
        icon: 'select',
        text: 'Select',
        action: () => this.setState({mode: 'select'})
      },
      {
        mode: 'insert',
        icon: 'insert',
        text: 'Insert',
        action: () => this.setState({mode: 'insert'})
      },
      {
        mode: 'move',
        icon: 'move',
        text: 'Move',
        action: () => this.setState({mode: 'move'})
      },
    ]

    // determine view props
    let disabled = ViewEditMode.isStaticMode(this.state.mode)
    let expanded = false;

    // handlers
    let itemHandlers    = undefined;
    let spacerHandlers  = undefined;

    // set props based mode
    if (!ViewEditMode.isStaticMode(this.state.mode)) {
      itemHandlers = {
        onStart: this.onStart,
        onStop: this.onDrop,
        onDrag: this.handleDrag,};
      spacerHandlers = {};
    }
    if (this.state.mode === 'insert') {
      disabled = true;
      expanded = true;
    }
    if (this.state.mode === 'select') {
      itemHandlers ={
        onClick: this.onClick,
      }
    }

    return (
      <div>

        <ModeMenu mode={this.state.mode}
                  buttons={menu_buttons}
                  heading={`Main Items`}
        />

        <div className={`feature-space`}>

          <div className={[
            `main`,
            (expanded ? 'expanded' : ''),
            this.state.mode,
            (this.state.selecting ? 'selecting' : ''),
          ].join(' ')}>

            <ContextMenu2
              //disabled={props.disabled}
              content={this.contextMenu}
              onContextMenu={this.onContextMenu}>

              <RearrangeableList id={`mainItems`}
                                 active={this.state.activeDrags}
                                 selected_id={this.state.selected.key}
                                 disabled={disabled}
                                 itemHandlers={itemHandlers}
                                 spacerHandlers={spacerHandlers}
                                 selected={this.state.selected.key}
              >
                {this.state.items}
              </RearrangeableList>

              <Xarrow start='0' end={this.state.items.length.toString()}
                      color={'purple'}
                      showHead={false}
                      startAnchor='left'
                      endAnchor='right'
                      curveness={0}
                      path={'straight'}
              />

            </ContextMenu2>
          </div>{/* /.main */}

          <div className={`selection bp4-elevation-2 ` + this.state.mode}
               hidden={this.state.mode !== 'insert'}>
            <H1>Available Items:</H1>
            <RearrangeableList id={`availableItems`}
                               itemHandlers={itemHandlers}
            >
              {this.state.availableItems}
            </RearrangeableList>
          </div>{/* /.section */}

        </div>{/* /.feature-space */}

      </div>
    );
  }
}