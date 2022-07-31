import React from 'react';

import './viewEditMode.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


class RearrangeableList extends React.Component {
  render() {
    return (
      <div id={this.props.id} className={this.props.active ? 'active' : ''}>

        {this.props.children.map(
          (item, index) =>
            <div id={index}
                 key={index.toString()}
                 className={`feature-group`}
            >
              {this.props.spacerHandlers ?
                <ItemSpacer {...this.props.spacerHandlers} /> :
                ''
              }
              <FeatureItem disabled={this.props.disabled}
                           contextMenu={this.props.contextMenu}
                           onContextMenu={this.props.onContextMenu}
                           {...this.props.itemHandlers} >
                {item}
              </FeatureItem>
            </div>
        )}
        <ItemSpacer id={this.props.children.length} {...this.props.spacerHandlers} style={{gridRow: 1}}/>

      </div>
    );
  }

}

export default RearrangeableList;