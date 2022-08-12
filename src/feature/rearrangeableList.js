import {
  OL,
  Classes,
} from '@blueprintjs/core'
import React from 'react';

import './featureView.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


export class RearrangeableList extends React.Component {
  constructor(props) {
    super(props);

    if (props.linked) {
      this.state = {
        controlledPosition: {
          x: null, y: null
        },
      }
    }
  }

  handleDrag = (e, position) => {
    const {x, y} = position;
    this.setState({
      controlledPosition: {
        x: x,
        y: y
      }
    });
  };

  resetPosition = () => {
    this.setState({
      controlledPosition: {
        x: null,
        y: null
      }
    })
  }

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

              {(this.props.spacerHandlers &&              // `{} === true`
                this.props.linked &&                      // checks property exists for next logical statement

                (!this.props.linked.linked[index] ||      // do not show spacers between linked features
                  this.props.linked.starts[index])) ?
                <ItemSpacer {...this.props.spacerHandlers} /> :
                ''
              }

              <FeatureItem disabled={this.props.disabled}
                           selected={(this.props.selected) ? this.props.selected[index] : false}
                           data={data}

                           // linked handler + position
                           onDrag={(this.props.linked && this.props.linked.linked[index] && this.props.selected) ? this.handleDrag : undefined}
                           position={(this.props.linked && this.props.linked.linked[index] && this.props.selected) ? this.state.controlledPosition : undefined}
                           onMouseLeave={this.resetPosition}
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