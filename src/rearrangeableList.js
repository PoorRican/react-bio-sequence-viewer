import React from 'react';

import './index.css'
import {ItemSpacer} from "./itemSpacer";
import {ListItem} from "./listItem";


class RearrangeableList extends React.Component {
  render() {
    return (
      <div className={this.props.active ? 'active' : ''}>

        {this.props.items.map(
          (item, index) =>
            <ListItem key={index.toString()} id={index}
                      disabled={this.props.disabled}
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