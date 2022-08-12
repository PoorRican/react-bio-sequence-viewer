import React from 'react'

import {DataContext} from "./data";
import {ModeMenu} from "./modeMenu";

export default class Container extends React.Component {
  static contextType = DataContext

  constructor(props, context) {
    super(props, context)
    this.state = {
      mode: this.context.mode
    }
  }

  render() {
    const menu_buttons = [
      {
        mode: 'view',
        icon: 'eye-open',
        text: 'View',
        action: () => this.context.setMode('view')
      },
      {
        mode: 'select',
        icon: 'select',
        text: 'Select',
        action: () => this.context.setMode('select')
      },
      {
        mode: 'insert',
        icon: 'insert',
        text: 'Insert',
        action: () => this.context.setMode('insert')
      },
      {
        mode: 'move',
        icon: 'move',
        text: 'Move',
        action: () => this.context.setMode('move')
      },
    ]

    return(
      <div>

        <ModeMenu mode={this.context.mode}
                  buttons={menu_buttons}
                  heading={`Main Items`} />

        {this.props.children}

      </div>
    )
  }
}