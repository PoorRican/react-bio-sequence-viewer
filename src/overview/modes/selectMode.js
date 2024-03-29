import React from 'react'

import {FeatureContext} from '../data'
import MainItems from "../components/mainItems";


export default class SelectMode extends React.Component {
  static contextType = FeatureContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      selecting: false,
    }
  }

  // handler functions
  onClick = (e) => {
    this.context.select(e.target, this.state.selecting);
    this.setState({selecting: !this.state.selecting});
  }

  render() {
    const itemHandlers = {
      onClick: this.onClick
    }

    return(
      <div className={`feature-space`}>

        <MainItems active={false} disabled={true}
                   context={this.context}
                   itemHandlers={itemHandlers}/>

      </div>
    )
  }

}
