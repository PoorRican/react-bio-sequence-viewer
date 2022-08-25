import React from "react";
import {
  Classes, UL
} from "@blueprintjs/core";

import {colorize} from "../helpers";
import {FeatureLine} from "../../components/featureLine";
import {SequenceContext} from "../data";

import './featureRowBar.css'


/**
 * Renders hierarchy structure of features contained in the given slice/row as simple lines.
 *
 * Hierarchy is passed via `props.children`.
 *
 * @param props.children {[{},]} - Hierarchy to display
 * @param props.scroll {boolean} - Toggles scrollbar functionality
 * @param props.length {number} - The number of indices to be represented.
 * @param props.range {[number, number]} - Defines start and end of row.
 */
export default class FeatureRowBar extends React.Component {
  static contextType = SequenceContext;

  render() {
    return (
      <UL className={[
        `feature-bar`,
        Classes.LIST_UNSTYLED,
      ].join(' ')}
          style={{gridTemplateColumns: 'repeat(auto-fill, calc(100% / ' + this.props.length + ')'}}>

        {this.props.children.map((feature) => {
          return <FeatureLine key={feature.id}
                              id={feature.id}
                              location={feature.location}
                              depth={feature.depth}
                              color={colorize(feature.depth)}
                              highlighted={this.context.highlighted ? this.context.highlighted.id === feature.id : false}
                              onMouseEnter={() => this.context.setHighlighted(feature.id)}
                              onMouseLeave={() => this.context.setHighlighted(null)}
          />
        }) }

      </UL>
    )
  }
}