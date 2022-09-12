import React from 'react'
import PropTypes from "prop-types";


export class FeatureForm extends React.PureComponent {
  render() {
    return(
      <input data-attribute={'id'} value={this.props.id} onChange={this.props.update} />
    )
  }
}

FeatureForm.propTypes = {
  /**
   * Callback function to update form input in parent component's state
   */
  update: PropTypes.func.isRequired,
  /**
   * Initial value of `id` input
   */
  id: PropTypes.string,
}