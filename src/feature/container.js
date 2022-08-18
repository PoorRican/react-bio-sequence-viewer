import React from 'react'

import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";

import {DataContext, _delete} from "./data";
import {ModeMenu, MODES} from "./modeMenu";
import {
  isFeature, isLinked, isSelected,
  getItem,
} from "./helpers";
import {
  link, unlink,
} from "./data";

// modes
import ViewMode from "./viewMode";
import InsertMode from "./insertMode";
import SelectMode from "./selectMode";
import MoveMode from "./moveMode";


export default class Container extends React.Component {
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.context.mode
    }
  }

  /**
   * Updates selection to event target when opening context menu
   */
  onContextMenu = (e) => {
    const inFeature = isFeature(e.target);
    if (inFeature) {

      const [key, container] = getItem(e.target);

      if (!isSelected(this.context.selected, key, container)) {
        this.context.select(e.target);      // cancel previous selections
      }

    } else {
      // clear selection if not clicked on a feature
      this.context.unselect();
    }
  }

  contextMenu = () => {
    const invalidSel = this.context.selected.index === null || !(this.context.selected.container === 'mainItems')
    const linked = isLinked(this.context.linked, this.context.selected.index)
    return (
      <Menu>
        <MenuItem2 text={`Delete`}
                   icon={`trash`}
                   onClick={this.doDelete}
                   intent={`danger`}
                   disabled={invalidSel}
        />
        <MenuItem2 text={linked ? `Unlink` : `Link`}
                   icon={linked ? `graph-remove` : `new-object`}
                   onClick={linked ? this.doUnlink : this.doLink}
                   disabled={invalidSel}
        />
      </Menu>
    )
  }

  // context menu functions
  doItemContextMenuAction(func, args, container) {
    let items;

    if (container === 'linked') {
      items = func(this.context.linked, ...args);
      this.context.setLinked(items);
    } else {
      container = this.context.selected.container;
      items = func(this.context.items[container], ...args);
      this.context.setItems(items);
    }

    // set state
    this.context.unselect();
  }

  doDelete = () => {
    this.doItemContextMenuAction(_delete, [this.context.selected.index]);

    if (!(typeof(this.context.selected.index) === 'number')) {
      this.context.setLinked(unlink(this.context.linked, this.context.selected.index));
    }
  }

  doLink = () => {
    this.doItemContextMenuAction(link, [this.context.selected.index], 'linked')
  }

  doUnlink = () => {
    this.doItemContextMenuAction(unlink, [this.context.selected.index], 'linked')
  }


  render() {
    const menu_buttons = [
      {
        mode: 'view',
        icon: 'eye-open',
        text: 'View',
        action: () => this.context.setMode('view')
      },
      {
        mode: 'select',
        icon: 'select',
        text: 'Select',
        action: () => this.context.setMode('select')
      },
      {
        mode: 'insert',
        icon: 'insert',
        text: 'Insert',
        action: () => this.context.setMode('insert')
      },
      {
        mode: 'move',
        icon: 'move',
        text: 'Move',
        action: () => this.context.setMode('move')
      },
    ]



    return(
      <div>

        <ModeMenu mode={this.context.mode}
                  buttons={menu_buttons}
                  heading={`Main Items`} />

        <ContextMenu2
          content={this.contextMenu}
          onContextMenu={this.onContextMenu}>

          {(this.context.mode === MODES.view) ?
            <ViewMode /> : null}
          {(this.context.mode === MODES.select) ?
            <SelectMode /> : null}
          {(this.context.mode === MODES.insert) ?
            <InsertMode /> : null}
          {(this.context.mode === MODES.move) ?
            <MoveMode /> : null}
        </ContextMenu2>

      </div>
    )
  }
}