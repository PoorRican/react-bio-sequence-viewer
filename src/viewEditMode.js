import React from "react";
import {H1, Menu,} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";
import Xarrow from "react-xarrows";

import {generateFeatures} from "./feature"
import {FeatureDialog} from "./featureDialog"
import {ModeMenu} from "./modeMenu";
import {RearrangeableList} from "./rearrangeableList";

import './viewEditMode.css'

export class ViewEditMode extends React.Component {
  static isStaticMode(mode) {
    const modes = ['view', 'select'];
    return Boolean(modes.indexOf(mode) + 1);
  }

  constructor(props) {
    super(props);

    const features = generateFeatures(30);

    let mainItems = props.items;
    if (mainItems === undefined) {
      mainItems = features.slice(0,15);
    }

    let availableItems = props.availableItems;
    if (availableItems === undefined) {
      availableItems = features.slice(15, 30);
    }

    this.state = {
      mode: 'view',
      featureDialogOpen: false,
      items: {
        mainItems: mainItems,

        availableItems: availableItems
      },
      activeDrags: 0,
      controlledPosition: {
        x: null, y: null
      },
      linked: [],
      selected: {
        key: null,
        content: null,
      },
      selecting: false,
    };
  }

  // helper functions
  clearSelected() {
    this.setState({
      selected: {
        key: null,
        container: null,
        content: null,
      },
      selecting: false,
    })
  }

  // feature functions
  isFeature(target) {
    if (target) {
      if (target.classList && target.classList.contains('feature')) {
        return true;
      } else {
        return this.isFeature(target.parentNode)
      }
    }
  }

  isSelected(index, container='') {
    const key = this.state.selected.key;

    if (key === null || key === undefined) {
      return false
    }

    if (container && !(container === this.state.selected.container)) {
      return false;
    }

    else if (typeof(key) === "number") {
      return key === index
    }

    else if (index >= key[0] && index <= key[1]) {
      return true;
    }

    return false;
  }

  isLinked(index) {
    if (index === null) {
      return false;
    } else if (typeof(index) === 'number') {
      for (let i = 0; i < this.state.linked.length; i++) {
        const obj = this.state.linked[i]
        if (index >= obj[0] && index <= obj[1] ) {
          return i+1;
        }
      }
      return false;
    } else {
      const linked = index.map((val) => {return this.isLinked(val)})
      return linked.reduce((a, b) => {return a && b && true})
    }
  }

  getContainer(target) {
    const id = target.id
    if (id === `mainItems` || id === `availableItems`) {
      return id;
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
    if (this.state.mode === 'view') {
      this.select(e.target);
      this.setState({featureDialogOpen: true})
    } else if (this.state.mode === 'select') {
      this.select(e.target);
    }
  }

  onStart = (e) => {
    this.setState({activeDrags: this.state.activeDrags + 1});

    const key = Number(this.getItemId(e.target));
    const container = this.getContainer(e.target);
    const content = this.getItem(container, key)
    this.setState({
        selected: {
          key: key,
          container,
          content: content,
        }
      });
  };

  onDrop = (e) => {
    this.setState({activeDrags: this.state.activeDrags - 1});
    if (e.target.classList.contains("drop-target") && !(e.target.classList.contains("react-draggable-dragging"))) {

      const selected = this.state.selected;
      const key = Number(this.getItemId(e.target));
      const container = this.getContainer(e.target);

      let items = this.state.items;
      if (this.state.mode === `insert`) {
        items[container] = ViewEditMode.insert(items[container], selected.content, key);
      }
      else if (this.state.mode === 'move') {
        items[container] = ViewEditMode.move(items[container], selected.content, [selected.key, key])
      } else {
        return;
      }

      this.setState({items: items});
      this.shiftLinked(key, 1)
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
      const container = this.getContainer(e.target)

      if (!this.isSelected(key, container)) {
        // cancel previous selections
        this.setState({selecting: false});
        this.select(e.target, false);
      }
    } else {
      this.clearSelected();
    }
  }

  contextMenu = () => {
    const selected = this.state.selected.key === null
    const linked = this.isLinked(this.state.selected.key)
    return (
      <Menu>
        <MenuItem2 text={`Delete`}
                   icon={`trash`}
                   onClick={this.doDelete}
                   intent={`danger`}
                   disabled={selected}
        />
        <MenuItem2 text={linked ? `Unlink` : `Link`}
                   icon={linked ? `graph-remove` : `new-object`}
                   onClick={linked ? this.doUnlink : this.doLink}
                   disabled={selected}
        />
      </Menu>
    )
  }

  linkedAnchors() {
    let starts = Array(this.state.items.mainItems.length).fill(false);
    let ends = Array(this.state.items.mainItems.length).fill(false);
    for (let i = 0; i < this.state.linked.length; i++) {
      const pos = this.state.linked[i];
      starts[pos[0]] = true;
      ends[pos[1]] = true;
    }
    return [starts, ends]
  }

  onDialogClose = () => {
    this.setState({featureDialogOpen: false});
    this.clearSelected();
  }

  // list manipulation functions
  getItem(container, key) {
    return this.state.items[container][key];
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
    let s2, s3;
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
    if (typeof(position) === 'number') {
      const s1 = list.slice(0, position);
      const s2 = list.slice(position + 1);
      return s1.concat(s2)
    } else {
      const s1 = list.slice(0, position[0]);
      const s2 = list.slice(position[1] + 1);
      return s1.concat(s2)
    }
  }

  select(target, toggle=true) {
    const key = Number(this.getItemId(target));
    const container = this.getContainer(target)
    const linked = this.isLinked(key)     // index + 1 if linked

    if (this.state.selecting) {
      const prev_sel_key = this.state.selected.key
      let sorted;

      // occurs when a linked item is selected
      if (container === 'mainItems' && (linked || typeof(prev_sel_key) !== 'number')) {
        if (linked) {
          // linked item is selected last
          const keys = this.state.linked[linked-1];
          sorted = [prev_sel_key, keys[0], keys[1]].sort();
        } else {
          // linked item is selected first
          sorted = [prev_sel_key[0], prev_sel_key[1], key].sort()
        }
        sorted.splice(1,1)

      } else {

        sorted = [prev_sel_key, key].sort()

      }

      this.setState({
        selected: {
          key:        sorted,
          container:  container,
          content:    this.state.items.mainItems.slice(sorted[0], sorted[1]),
        }
      })

    } else {                        // this runs first

      if (container === 'mainItems' && linked) {

        const keys = this.state.linked[linked-1];

        this.setState({
          selected: {
            key: keys,
            container: container,
            content: this.state.items.mainItems.slice(keys[0], keys[1]+1)
          }
        })

      } else {

        this.setState({
          selected: {
            key: key,
            container: container,
            content: this.state.items[container][key],
          }
        });
      }
    }

    if (toggle) {
      this.setState({selecting: !this.state.selecting});
    }
  }

  link = (list, positions) => {
    // in this case, `list` is `state.linked`
    for (let i = 0; i < positions.length; i++) {
      if (this.isLinked(positions[i])) {
        // leave linked items intact
        // TODO: show an error as toast
        console.info('already linked')
        return this.state.linked;
      }
    }

    console.info('linked ' + positions)
    return this.state.linked.concat([positions])
  }

  unlink = (list, positions) => {
    // `list` is `state.linked`
    for (let i = 0; i < this.state.linked.length; i++) {
      if (positions[0] === this.state.linked[i][0] &&
        positions[1] === this.state.linked[i][1]) {
        list.splice(i, 1);
        return list
      }
    }
  }

  shiftLinked(index, magnitude) {
    let linked = this.state.linked;
    for (let i = 0; i < linked.length; i++) {
      if (linked[i][0] >= index) {
        linked[i][0] += magnitude;
        linked[i][1] += magnitude;
      }
    }
    this.setState({linked: linked})
  }

  static swap(list, item, position) {
    const s1 = list.slice(0, position).concat({item});
    const s2 = list.slice(position + 1);
    return s1.concat(s2)
  }

  // Context menu functions

  doItemContextMenuAction(func, args, container) {
    let items = this.state.items;

    if (container) {
      items = func(this.state[container], ...args);
      let state = {};
      state[container] = items;
      this.setState(state);
    } else {
      container = this.state.selected.container;
      items[container] = func(this.state.items[container], ...args);
      this.setState({
        items: items
      });
    }

    // set state
    this.clearSelected();
  }

  doDelete = () => {
    this.doItemContextMenuAction(ViewEditMode.delete, [this.state.selected.key]);
    if (!(typeof(this.state.selected.key) === 'number')) {
      this.setState({
        linked: this.unlink(this.state.linked, this.state.selected.key)
      });
    }
  }

  doLink = () => {
    this.doItemContextMenuAction(this.link, [this.state.selected.key], 'linked')
  }

  doUnlink = () => {
    this.doItemContextMenuAction(this.unlink, [this.state.selected.key], 'linked')
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
    if (this.state.mode === 'view') {
      itemHandlers = {
        onClick: this.onClick,
      }
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

    // linked functionality
    const [linked_starts, linked_ends] = this.linkedAnchors();

    return (
      <div>

        <ModeMenu mode={this.state.mode}
                  buttons={menu_buttons}
                  heading={`Main Items`}
        />

        <div className={`feature-space`}>

          <div className={'main ' + [
            (expanded ? 'expanded' : ''),
            this.state.mode,
            (this.state.selecting ? 'selecting' : ''),
          ].join(' ')}>

            <ContextMenu2
              content={this.contextMenu}
              onContextMenu={this.onContextMenu}>

              <RearrangeableList id={`mainItems`}
                                 // state
                                 active={this.state.activeDrags}
                                 disabled={disabled}
                                 // data + handlers
                                 data={this.state.items.mainItems}
                                 itemHandlers={itemHandlers}
                                 spacerHandlers={spacerHandlers}
                                 // interaction states
                                 selected={(this.state.selected.container === 'mainItems') ?
                                   this.state.items.mainItems.map((item, index) => {return this.isSelected(index)}) : false}
                                 linked={{
                                   linked: this.state.items.mainItems.map((item, index) => {
                                     return this.isLinked(index)
                                   }),
                                   starts: linked_starts,
                                   ends: linked_ends,
                                 }}
              />

              <Xarrow start="0" end={this.state.items.mainItems.length.toString()}
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
                               data={this.state.items.availableItems}
                               itemHandlers={itemHandlers}
            />
          </div>{/* /.section */}

          <FeatureDialog
            isOpen={this.state.featureDialogOpen}
            data={this.state.selected.content}
            onClose={this.onDialogClose}
          />

        </div>{/* /.feature-space */}

      </div>
    );
  }
}