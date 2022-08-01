import {
  OL,
  Classes,
} from '@blueprintjs/core'
import React from 'react';

import './viewEditMode.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


class RearrangeableList extends React.Component {
  render() {
    return (
      <OL id={this.props.id}
          className={[
            this.props.active ? 'active' : '',
            Classes.LIST_UNSTYLED,
          ].join(' ')}
      >

        {this.props.children.map(
          (item, index) =>
            <li id={index}
                 key={index.toString()}
                 className={`feature-group ` + (this.props.selected_id === index ? 'selected' : '')}
            >
              {this.props.spacerHandlers ?
                <ItemSpacer {...this.props.spacerHandlers} /> :
                ''
              }
              <FeatureItem disabled={this.props.disabled}
                           {...this.props.itemHandlers} >
                {item}
              </FeatureItem>
            </li>
        )}

        <ItemSpacer id={this.props.children.length} {...this.props.spacerHandlers} style={{gridRow: 1}}/>

      </OL>
    );
  }

}

export default RearrangeableList;