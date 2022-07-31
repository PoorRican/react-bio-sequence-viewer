import React from 'react';

import './viewEditMode.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


class RearrangeableList extends React.Component {
  render() {
    return (
      <div id={this.props.id} className={this.props.active ? 'active' : ''}>

        {this.props.items.map(
          (item, index) =>
            <FeatureItem key={index.toString()} id={index}
                         disabled={this.props.disabled}
                         contextMenu={this.props.contextMenu}
                         onContextMenu={this.props.onContextMenu}
                         {...this.props.itemHandlers}>
              {item}
            </FeatureItem>
        )}
        <ItemSpacer id={this.props.items.length}{...this.props.spacerHandlers} />

      </div>
    );
  }

}

export default RearrangeableList;