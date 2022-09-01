import React from "react";
import {
  Classes, UL
} from "@blueprintjs/core";
import PropTypes from "prop-types";

import FeatureLine from "./featureLine";
import {EditorContext} from "../editor/data";

import './featureBar.css'


/**
 * Visualizes `Feature` hierarchy as simple lines.
 *
 * Hierarchy is passed via `props.children`.
 *
 * @param props.hierarchy {Feature[]|{}[]} - Hierarchy to display
 * @param props.scroll {boolean} - Toggles scrollbar functionality
 * @param props.length {number} - The number of indices to be represented.
 */
export default class FeatureBar extends React.PureComponent {
  static contextType = EditorContext;
  static defaultProps = {
    scroll: false,
  }

  // TODO: implement popover element to show info on highlighted feature
  // TODO: implement `onClick` function to set `this.context.cursor`

  renderLines = () => {
    let lines = [];
    this.props.features.forEach(feature => {
      lines.push(<FeatureLine key={feature.accessor}
                              feature={feature}
                              highlighted={this.context.highlighted ? this.context.highlighted.accessor === feature.accessor : false}
                              onMouseEnter={() => this.context.setHighlighted(feature.accessor)}
                              onMouseLeave={() => this.context.setHighlighted(null)}
                              onClick={() => this.context.setCursor(feature.accessor)}
      />)
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