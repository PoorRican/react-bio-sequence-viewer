import React from 'react'
import {
  Classes,
  Dialog,
  Button,
} from '@blueprintjs/core'
import PropTypes from "prop-types";

import {FeatureContent} from "./featureContent";

/**
 * Displays an onscreen dialog for viewing data of a `Feature`.
 *
 * @param isOpen {boolean} - Controls display of dialog
 * @param onClose {function} - Callback function to close dialog
 * @param data {RenderFeature} - `Feature` to display
 * @param children=FeatureContent {JSX.Element} - Dialog content to render.
 * If not passed, renders `FeatureContent` to remain functional for `overview` module.
 *
 * @returns {JSX.Element}
 * @constructor
 */
export class FeatureDialog extends React.Component {
  render() {
    return (
      <Dialog isOpen={this.props.isOpen}
              onClose={this.props.onClose}
              title={this.props.title}
              icon={this.props.icon}
              onOpening={this.props.initialize}
              lazy={true}
      >
        {(this.props.children) ?
          <div className={Classes.DIALOG_BODY}>
            {this.props.children}
          </div>
          : <FeatureContent data={this.props.data} />}



        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            {this.props.footer.map((button) => {
              return <Button key={button.text}
                             onClick={button.onClick}
                             intent={button.intent}
                             icon={button.icon}
                             text={button.text} />
            })}
          </div>
        </div>

      </Dialog>
    )
  }
}
FeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  /**
   * Callback function to close dialog
   */
  onClose: PropTypes.func.isRequired,
  /**
   * `Feature` object to display. Gets passed to `FeatureContent`
   */
  data: PropTypes.object,
  title: PropTypes.string,
  icon: PropTypes.string,
  /**
   * Array of footer contents
   */
  footer: PropTypes.arrayOf(PropTypes.exact({
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
    intent: PropTypes.string,
    icon: PropTypes.string,
  })),
  /**
   * Callback to run when opening dialog.
   *
   * @see Dialog.onOpening
   */
  onOpening: PropTypes.func,
}