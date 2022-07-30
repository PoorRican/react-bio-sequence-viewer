import React from 'react';

import './viewEditMode.css'
import {ItemSpacer} from "./itemSpacer";
import {ListItem} from "./listItem";


class RearrangeableList extends React.Component {
  render() {
    return (
      <div id={this.props.id} className={this.props.active ? 'active' : ''}>

        {this.props.items.map(
          (item, index) =>
            <ListItem key={index.toString()} id={index}
                      disabled={this.props.disabled}
                      contextMenu={this.props.contextMenu}
                      onContextMenu={this.props.onContextMenu}
                      {...this.props.itemHandlers}>
              {item}
            </ListItem>
        )}
        <ItemSpacer id={this.props.items.length}{...this.props.spacerHandlers} />

      </div>
    );
  }

}

export default RearrangeableList;