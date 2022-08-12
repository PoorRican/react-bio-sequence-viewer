import React from 'react'
import {Menu} from "@blueprintjs/core";
import {ContextMenu2, MenuItem2} from "@blueprintjs/popover2";
import Xarrow from "react-xarrows";

import {
  isLinked,
  isFeature,
  getItemId,
  getContainer,
  isSelected,
  linkedAnchors,
} from './helpers'
import {FeatureDialog} from "./featureDialog";
import {DataContext, MODES} from './data'
import {RearrangeableList} from "./rearrangeableList";


export default class ViewMode extends React.Component {
  static contextType = DataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      featureDialogOpen: false,
    }
  }

  // handler functions
  onClick = (e) => {
    const key = Number(getItemId(e.target));
    const container = getContainer(e.target)

    this.context.setSelected({
      key: key,
      container: container,
      content: this.context.items[container][key],
    });

    this.setState({featureDialogOpen: true})
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
        this.context.setSelected({
          key: key,
          container: container,
          content: this.context.items[container][key],
        });
      }

    } else {
      // clear selection if not clicked on a feature
      this.clearSelected();
    }
  }

  contextMenu = () => {
    const selected = this.context.selected.key === null
    const linked = isLinked(this.context.linked, this.context.selected.key)
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

  render() {
    const itemHandlers = {
      onClick: this.onClick
    }

    const [linked_starts, linked_ends] = linkedAnchors(this.context.items, this.context.linked);

    return(
      <div className={`feature-space`} hidden={this.context.mode === MODES.view}>

        <div className={'main ' + [
          this.context.mode,
        ].join(' ')}>

          <ContextMenu2
            content={this.contextMenu}
            onContextMenu={this.onContextMenu}>

            <RearrangeableList id={`mainItems`}
              // state
                               active={false}
                               disabled={true}
              // data + handlers
                               data={this.context.items.mainItems}
                               itemHandlers={itemHandlers}
              // interaction states
                               selected={(this.context.selected.container === 'mainItems') ?
                                 this.context.items.mainItems.map((item, index) => {
                                   return isSelected(this.context.selected, index)
                                 }) : false}
                               linked={{
                                 linked: this.context.items.mainItems.map((item, index) => {
                                   return isLinked(this.context.linked, index)
                                 }),
                                 starts: linked_starts,
                                 ends: linked_ends,
                               }}
            />

            <Xarrow start="0" end={this.context.items.mainItems.length.toString()}
                    color={'purple'}
                    showHead={false}
                    startAnchor='left'
                    endAnchor='right'
                    curveness={0}
                    path={'straight'}
            />

          </ContextMenu2>
        </div>{/* /.main */}

        <FeatureDialog
          isOpen={this.state.featureDialogOpen}
          data={this.context.selected.content}
          onClose={this.onDialogClose}
        />

      </div>
  )
  }

}