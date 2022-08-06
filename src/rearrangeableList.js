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

        {this.props.data.map(
          (data, index) =>
            <li id={index.toString()}
                key={index}
                className={[
                  `feature-group`,
                  (this.props.linked) ? (this.props.linked.linked[index] ? 'linked' : '') : false,
                  (this.props.linked) ? (this.props.linked.starts[index] ? 'linked-start' : '') : false,
                  (this.props.linked) ? (this.props.linked.ends[index] ? 'linked-end' : '') : false,
                ].join(' ')}
            >
              {(this.props.spacerHandlers &&
                this.props.linked &&
                (!this.props.linked.linked[index] || this.props.linked.starts[index])) ?
                <ItemSpacer {...this.props.spacerHandlers} /> :
                ''
              }
              <FeatureItem disabled={this.props.disabled}
                           selected={(this.props.selected) ? this.props.selected[index] : false}
                           data={data}
                           {...this.props.itemHandlers}
              >
              </FeatureItem>
            </li>
        )}

        <li id={(this.props.data.length).toString()} key={this.props.data.length} className={`feature-group`}>
          <ItemSpacer{...this.props.spacerHandlers} style={{gridRow: 1}}/>
        </li>

      </OL>
    );
  }

}

export default RearrangeableList;