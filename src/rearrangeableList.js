import {
  OL,
  Classes,
} from '@blueprintjs/core'
import React from 'react';

import './viewEditMode.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


class RearrangeableList extends React.Component {
  isSelected(index) {

    if (this.props.selected === null ||
        this.props.selected === undefined) {
      return false
    }

    else if (typeof(this.props.selected) === "number") {
      return this.props.selected === index
    }

    else if ((index <= this.props.selected[0] && index >= this.props.selected[1]) ||
             (index >= this.props.selected[0] && index <= this.props.selected[1])) {
      return true;
    }

    return false;
  }

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
                className={[
                  `feature-group`,
                ].join(' ')}
            >
              {this.props.spacerHandlers ?
                <ItemSpacer {...this.props.spacerHandlers} /> :
                ''
              }
              <FeatureItem disabled={this.props.disabled}
                           selected={this.isSelected(index)}
                           {...this.props.itemHandlers}
              >
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