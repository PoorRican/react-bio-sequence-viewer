import React from "react";
import {
  Classes, UL
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import FeatureLine from "./featureLine";
import {SequenceContext} from "../editor/data";

import './featureBar.css'


/**
 * Visualizes `Feature` hierarchy as simple lines.
 *
 * Hierarchy is passed via `props.children`.
 *
 * @param props.features {Feature[]|{}[]} - Hierarchy to display
 * @param props.scroll {boolean} - Toggles scrollbar functionality
 * @param props.length {number} - The number of indices to be represented.
 */
export default class FeatureBar extends React.PureComponent {
  static contextType = SequenceContext;
  static defaultProps = {
    scroll: false,
  }

  renderLines = () => {
    let lines = [];
    this.props.features.forEach(feature => {
      lines.push(<FeatureLine key={feature.id}
                              depth={feature.depth} location={feature.location} id={feature.id}
                              highlighted={this.context.highlighted ? this.context.highlighted.id === feature.id : false}
                              onMouseEnter={() => this.context.setHighlighted(feature.id)}
                              onMouseLeave={() => this.context.setHighlighted(null)} />)
    })
    return lines;
  }

  render() {
    return (
      <UL className={[
        `feature-bar`,
        Classes.LIST_UNSTYLED,
      ].join(' ')}
          style={{gridTemplateColumns: 'repeat(auto-fill, calc(100% / ' + this.props.length + ')'}}>

        {this.renderLines()}

      </UL>
    )
  }
}

FeatureBar.propTypes = {
  features: PropTypes.array.isRequired,
  scroll: PropTypes.bool,
  length: PropTypes.number.isRequired,
}