import React from 'react'

import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";

import {DataContext, _delete} from "./data";
import {ModeMenu, MODES} from "./modeMenu";
import {
  getContainer, getItemId,
  isFeature, isLinked, isSelected,
} from "./helpers";
import {
  link, unlink,
} from "./data";

// modes
import ViewMode from "./viewMode";
import InsertMode from "./insertMode";
import SelectMode from "./selectMode";


export default class Container extends React.Component {
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.context.mode
    }
  }

  clearSelected() {
    this.context.setSelected({
      key: null,
      container: null,
      content: null,
    })
  }

  select(target) {
    const key = Number(getItemId(target));
    const container = getContainer(target);
    const linked = isLinked(this.context.linked, key);    // index + 1 if linked

    if (container === 'mainItems' && linked) {
      const keys = this.context.linked[linked-1];

      this.context.setSelected({
        key: keys,
        container: container,
        content: this.context.items.mainItems.slice(keys[0], keys[1]+1)
      })

    } else {

      this.context.setSelected({
        key: key,
        container: container,
        content: this.context.items[container][key],
      });

    }
  }

  /**
   * Updates selection to event target when opening context menu
   */
  onContextMenu = (e) => {
    const inFeature = isFeature(e.target);
    if (inFeature) {

      const key = Number(getItemId(e.target));
      const container = getContainer(e.target)

      if (!isSelected(this.context.selected, key, container)) {
        // cancel previous selections
        this.select(e.target);
      }

    } else {
      // clear selection if not clicked on a feature
      this.clearSelected();
    }
  }

  contextMenu = () => {
    const invalidSel = this.context.selected.key === null || !(this.context.selected.container === 'mainItems')
    const linked = isLinked(this.context.linked, this.context.selected.key)
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
    this.clearSelected();
  }

  doDelete = () => {
    this.doItemContextMenuAction(_delete, [this.context.selected.key]);

    if (!(typeof(this.context.selected.key) === 'number')) {
      this.context.setLinked(unlink(this.context.linked, this.context.selected.key));
    }
  }

  doLink = () => {
    this.doItemContextMenuAction(link, [this.context.selected.key], 'linked')
  }

  doUnlink = () => {
    this.doItemContextMenuAction(unlink, [this.context.selected.key], 'linked')
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
        </ContextMenu2>

      </div>
    )
  }
}