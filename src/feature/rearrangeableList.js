import {
  OL,
  Classes,
} from '@blueprintjs/core'
import React from 'react';

import './featureView.css'
import {ItemSpacer} from "./itemSpacer";
import {FeatureItem} from "./featureItem";


/**
 * Renders a sequence of `FeatureItem` and `SpacerItem` components and renders components.
 *
 * `FeatureItem` components will return to their original position on `MouseUp` events.
 *
 * When the `linked` prop is given, linked `FeatureItem` component groups are all dragged in unison.
 *
 * Rendering of `SpacerItem` components is controlled by the `spacer` prop.
 * For linked features, only the first `SpacerItem` is rendered.
 *
 * @param props.data {[]} - List of `Feature` objects
 * @param props.selected {[boolean]} - Controls `FeatureItem` styling and also is used when dragging linked groups.
 * @param props.linked {[boolean]} - Controls `FeatureItem` styling and draggable functionality.
 * @param props.spacer {boolean} - Renders of `SpacerItem` components when `true`
 * @param props.disabled {boolean} - Disables draggable functionality of `FeatureItem` components when `true`
 *
 * @returns {JSX.Element}
 */
export default class RearrangeableList extends React.Component {
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

              {(this.props.spacers &&
                this.props.linked &&
                (!this.props.linked.linked[index] ||      // do not show spacers between linked features
                  this.props.linked.starts[index])) ?     // only show first spacer for linked features
                <ItemSpacer /> :
                ''
              }

              <FeatureItem disabled={this.props.disabled}
                           selected={(this.props.selected) ? this.props.selected[index] : false}
                           data={data}

                           // linked handler + position
                           onDrag={(this.props.linked && this.props.linked.linked[index] && this.props.selected[index]) ? this.handleDrag : undefined}
                           position={(this.props.linked && this.props.linked.linked[index] && this.props.selected[index]) ? this.state.controlledPosition : undefined}
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