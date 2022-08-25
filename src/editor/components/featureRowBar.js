import React from "react";
import {
  Classes, UL
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import {colorize} from "../helpers";
import FeatureLine from "../../components/featureLine";
import {SequenceContext} from "../data";
import {Feature} from "../../types/feature";

import './featureRowBar.css'


/**
 * Visualizes `Feature` hierarchy as simple lines.
 *
 * Hierarchy is passed via `props.children`.
 *
 * @param props.children {Feature[]} - Hierarchy to display
 * @param props.scroll {boolean} - Toggles scrollbar functionality
 * @param props.length {number} - The number of indices to be represented.
 */
export default class FeatureRowBar extends React.PureComponent {
  static contextType = SequenceContext;
  static defaultProps = {
    scroll: false,
  }

  render() {
    return (
      <UL className={[
        `feature-bar`,
        Classes.LIST_UNSTYLED,
      ].join(' ')}
          style={{gridTemplateColumns: 'repeat(auto-fill, calc(100% / ' + this.props.length + ')'}}>

        {this.props.features.map((feature) => {
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

FeatureRowBar.propTypes = {
  features: PropTypes.arrayOf(Feature).isRequired,
  scroll: PropTypes.bool,
  length: PropTypes.number.isRequired,
}